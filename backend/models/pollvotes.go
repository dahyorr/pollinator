package models

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/dahyorr/pollinator/database"
	"github.com/jmoiron/sqlx"
)

type PollVote struct {
	Id           string
	PollId       string         `json:"poll_id" db:"poll_id"`
	PollOptionId string         `json:"poll_option_id" db:"poll_option_id"`
	UserId       sql.NullString `json:"user_id" db:"user_id"`
	CreatedAt    time.Time      `json:"created_at" db:"created_at"`
}

func (pv *PollVote) Save(_tx *sqlx.Tx) error {

	tx := _tx
	if tx == nil {
		tx = database.DB.MustBegin()
		defer func() {
			if p := recover(); p != nil {
				tx.Rollback()
				panic(p)
			}
		}()
	}

	if pv.Id == "" {
		err := tx.QueryRow("INSERT INTO poll_votes (poll_id, poll_option_id, user_id) VALUES ($1, $2, $3) RETURNING id, created_at",
			pv.PollId, pv.PollOptionId, pv.UserId).Scan(&pv.Id, &pv.CreatedAt)
		if err != nil {
			tx.Rollback()
			return errors.New("failed to create poll vote")
		}
	} else {
		_, err := tx.Exec("UPDATE poll_votes SET poll_option_id = $1 WHERE id = $2", pv.PollOptionId, pv.Id)
		if err != nil {
			tx.Rollback()
			return errors.New("failed to update poll vote")
		}
	}

	if _tx == nil {
		err := tx.Commit()
		if err != nil {
			return errors.New("failed to commit transaction")
		}
	}
	return nil
}


func SavePollVotes(pollId string, pollVotes []*PollVote, _tx *sqlx.Tx) error {

	tx := _tx
	if _tx == nil {
		tx := database.DB.MustBegin()
		defer func() {
			if p := recover(); p != nil {
				tx.Rollback()
				panic(p)
			}
		}()
	}

	for _, vote := range pollVotes {
		if vote.PollId != pollId {
			fmt.Println("Poll ids don't match")
			return errors.New("failed to create vote")
		}
		vote.Save(tx)
	}

	if _tx == nil {
		err := tx.Commit()
		if err != nil {
			return errors.New("failed to commit transaction")
		}
	}
	return nil
}

func GetPollVotesByUserId(pollId string, uid string) ([]PollVote, error) {
	var pvs []PollVote
	err := database.DB.Select(&pvs, "SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2 ", pollId, uid)
	return pvs, err
}
