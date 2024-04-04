package models

import "time"

type PollVote struct {
	Id           string
	PollId       string
	PollAnswerId string
	CreatedAt    time.Time
	// additional tracing info
}
