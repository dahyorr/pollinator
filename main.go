package main

import (
	"fmt"
	"time"

	"github.com/dahyorr/pollinator/database"
	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
)

func main() {
	// Your code here
	config := utils.InitConfig()
	err := database.Init(config)
	if err != nil {
		panic(err)
	}

	// Create a new poll
	pollAnswers := []models.PollAnswer{
		{Text: "Go"},
		{Text: "Python"},
		{Text: "JavaScript"},
		{Text: "Java"},
		{Text: "C++"},
		{Text: "Ruby"},
		{Text: "Rust"},
		{Text: "PHP"},
		{Text: "Swift"},
		{Text: "Kotlin"},
		{Text: "TypeScript"},
		{Text: "C#"},
	}
	poll, err := models.NewPoll("What is your favorite programming language?", pollAnswers, time.Now().AddDate(0, 0, 7))

	fmt.Println(poll, err)
}
