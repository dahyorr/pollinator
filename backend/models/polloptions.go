package models

type PollOption struct {
	Id     string `json:"id" db:"id"`
	Text   string `json:"text" db:"value"`
	PollId string `json:"poll_id" db:"poll_id"`
	Votes  int    `json:"votes" db:"votes"`
	// Votes
}
