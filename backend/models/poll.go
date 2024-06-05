package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/dahyorr/pollinator/database"
	"github.com/guregu/null/v5"
	"github.com/jmoiron/sqlx"
)

type Poll struct {
	Id             string    `json:"id" db:"id"`
	Question       string    `json:"question" db:"question"`
	EndDate        null.Time `json:"end_date" db:"end_date"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	ClosedAt       null.Time `json:"closed_at" db:"closed_at"`
	Status         string    `json:"status" db:"status"`
	MultipleChoice bool      `json:"multiple_choice" db:"multiple_choice"`
	RequireAuth    bool      `json:"require_auth" db:"require_auth"`
	Responses      int       `json:"responses" db:"responses"`
	UserId         string    `json:"user_id" db:"user_id"`

	Options []PollOption `json:"answers"`
	Votes   []PollVote   `json:"votes"`
}

func (p *Poll) Save() error {
	// Close the poll

	tx := database.DB.MustBegin()

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		}
	}()

	if p.Id == "" {
		err := tx.QueryRow("INSERT INTO poll (question, end_date, multiple_choice, require_auth, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, status",
			p.Question, p.EndDate, p.MultipleChoice, p.RequireAuth, p.UserId).Scan(&p.Id, &p.CreatedAt, &p.Status)
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			return errors.New("failed to create poll")
		}

		// Insert poll options
		stmt, err := tx.Prepare("INSERT INTO poll_options (value, poll_id) VALUES ($1, $2) RETURNING id")
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			return errors.New("failed to prepare poll options statement")
		}
		defer stmt.Close()

		for i := range p.Options {
			var optionId string
			err = stmt.QueryRow(p.Options[i].Text, p.Id).Scan(&optionId)
			if err != nil {
				tx.Rollback()
				fmt.Println(err)
				return errors.New("failed to create poll option")
			}
			p.Options[i].Id = optionId
			p.Options[i].PollId = p.Id
		}
	} else {
		// Update existing poll
		_, err := tx.Exec("UPDATE poll SET question = $1, end_date = $2, multiple_choice = $3, require_auth = $4, status = $5, closed_at = $6 WHERE id = $7",
			p.Question, p.EndDate, p.MultipleChoice, p.RequireAuth, p.Status, p.ClosedAt, p.Id)
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			return errors.New("failed to update poll")
		}

		// Update poll options
		for _, option := range p.Options {
			if option.Id == "" {
				// Insert new option
				var optionId string
				err := tx.QueryRow("INSERT INTO poll_options (value, poll_id) VALUES ($1, $2) RETURNING id", option.Text, p.Id).Scan(&optionId)
				if err != nil {
					tx.Rollback()
					fmt.Println(err)
					return errors.New("failed to create new poll option")
				}
				option.Id = optionId
			} else {
				// Update existing option
				_, err := tx.Exec("UPDATE poll_options SET value = $1 WHERE id = $2", option.Text, option.Id)
				if err != nil {
					tx.Rollback()
					fmt.Println(err)
					return errors.New("failed to update poll option")
				}
			}
		}
	}

	err := tx.Commit()
	if err != nil {
		fmt.Println(err)
		return errors.New("failed to commit transaction")
	}

	return nil
}

func GetPollById(id string, fetchOptions bool) (*Poll, error) {
	var poll Poll
	err := database.DB.Get(&poll, "SELECT * FROM poll WHERE id = $1", id)
	if err != nil {
		fmt.Println(err)
		return nil, errors.New("failed to get poll")
	}

	// Get poll options
	if fetchOptions {
		var options []PollOption
		err = database.DB.Select(&options, "SELECT * FROM poll_options WHERE poll_id = $1", id)
		if err != nil {
			fmt.Println(err)
			return nil, errors.New("failed to get poll options")
		}
		poll.Options = options

	}

	return &poll, nil

}

func (p *Poll) UpdatePollStatus(status string) error {
	// Close the poll
	if status == "closed" {
		p.Status = "closed"
		closedTime := null.TimeFrom(time.Now())
		p.ClosedAt = closedTime
	} else {
		p.Status = "open"
		p.ClosedAt = null.Time{}
	}
	_, err := database.DB.Exec("UPDATE poll SET status = $1, closed_at = $2 WHERE id = $3", p.Status, &p.ClosedAt, &p.Id)
	if err != nil {
		fmt.Println(err)
		return errors.New(`failed to update poll status`)
	}
	return nil
}

func (p *Poll) IncrementPollResponse(value int, _tx *sqlx.Tx) error {
	if _tx == nil {
		_, err := database.DB.Exec("UPDATE poll SET responses = responses + $1 WHERE id = $2", value, &p.Id)
		if err != nil {
			fmt.Println(err)
			return errors.New(`failed to update poll status`)
		}
	} else {
		_, err := _tx.Exec("UPDATE poll SET responses = responses + $1 WHERE id = $2", value, &p.Id)
		if err != nil {
			fmt.Println(err)
			return errors.New(`failed to update poll status`)
		}
	}

	return nil
}

func (p *Poll) Close() error {
	// Close the poll
	return p.UpdatePollStatus("closed")
}

func (p *Poll) Open() error {
	// Close the poll
	return p.UpdatePollStatus("open")
}
