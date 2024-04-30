package models

import (
	"errors"
	"fmt"

	"github.com/dahyorr/pollinator/database"
)

type PollVotes struct {
	Id           string
	PollId       string
	PollOptionId string
	UserId       string
}

func New(pollId string, pollOptionId []string, userId string) ([]*PollVotes, error) {
	// map pollOptionId to PollVotes
	var pollVotes []*PollVotes

	for _, option := range pollOptionId {
		vote := PollVotes{
			PollId:       pollId,
			PollOptionId: option,
			UserId:       userId,
		}
		pollVotes = append(pollVotes, &vote)
	}

	tx := database.DB.MustBegin()

	stmt, err := tx.Prepare("INSERT INTO poll_votes (poll_id, poll_option_id, user_id) VALUES ($1, $2, $3)")
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return nil, errors.New("failed to create vote")
	}
	defer stmt.Close()
	for _, vote := range pollVotes {
		_, err := stmt.Exec(vote.PollId, vote.PollOptionId, vote.UserId)
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			return nil, errors.New("failed to create vote")
		}
	}

	_, err = tx.Exec("UPDATE poll_options SET votes = votes + 1 WHERE id = $1", pollVotes[0].PollOptionId)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return nil, errors.New("failed to create vote")
	}

	_, err = tx.Exec("UPDATE poll SET responses = responses + 1 WHERE id = $1", pollId)
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return nil, errors.New("failed to create vote")
	}

	return pollVotes, nil

}
