package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/dahyorr/pollinator/database"
)

type Poll struct {
	Id             string
	Question       string
	EndDate        *time.Time
	CreatedAt      time.Time
	ClosedAt       *time.Time
	Status         string
	MultipleChoice bool
	responses      int
	// Answers  []PollAnswer
	// Votes    []PollVote
	// PollResults
}

type PollSettings struct {
	MultipleChoice bool
	EndDate        time.Time
}

// type PollRepository interface {
// 	FindAll() ([]Poll, error)
// 	FindById(id string) (*Poll, error)
// 	// Save(poll *Poll) error
// }

func NewPoll(question string, answers []string, settings *PollSettings) (*Poll, error) {
	// Create a new poll
	poll := Poll{
		Question:       question,
		EndDate:        &settings.EndDate,
		MultipleChoice: settings.MultipleChoice,
	}

	tx := database.DB.MustBegin()
	err := tx.QueryRow("INSERT INTO poll (question, end_date, multiple_choice) VALUES ($1, $2, $3) RETURNING id, created_at", poll.Question, poll.EndDate, poll.MultipleChoice).Scan(&poll.Id, &poll.CreatedAt)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return nil, errors.New("failed to create poll")
	}
	stmt, err := tx.Prepare("INSERT INTO poll_options (value, poll_id) VALUES ($1, $2)")
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return nil, errors.New("failed to create poll")
	}
	defer stmt.Close()
	for _, answer := range answers {
		_, err := stmt.Exec(answer, poll.Id)
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			return nil, errors.New("failed to create poll")
		}
	}
	err = tx.Commit()
	if err != nil {
		fmt.Println(err)
		tx.Rollback()
		return nil, errors.New("failed to create poll")
	}
	return &poll, nil
}

func (p *Poll) UpdatePollStatus(status string) error {
	// Close the poll
	if status == "closed" {
		p.Status = "closed"
		closedTime := time.Now()
		p.ClosedAt = &closedTime
	} else {
		p.Status = "open"
		p.ClosedAt = nil
	}
	_, err := database.DB.Exec("UPDATE poll SET status = $1, closed_at = $2 WHERE id = $3", p.Status, &p.ClosedAt, &p.Id)
	if err != nil {
		fmt.Println(err)
		return errors.New(`failed to update poll status`)
	}
	return nil
}

func (p *Poll) IncrementPollResponse() error {
	// Close the poll
	_, err := database.DB.Exec("UPDATE poll SET responses = responses + 1 WHERE id = $2", &p.Id)
	if err != nil {
		fmt.Println(err)
		return errors.New(`failed to update poll status`)
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

// func (p *Poll) AddVote(PollVote vote) error {
// 	// Add a vote to the poll
// 	p.Votes = append(p.Votes, vote)
// 	return nil
// }
