package handlers

import (
	"fmt"

	"github.com/dahyorr/pollinator/models"
	"github.com/gofiber/fiber/v2"
)

type AllowVoteData struct {
	PollId string `json:"poll_id" validate:"required"`
}

func GetVotes(c *fiber.Ctx) error {

	pollId := c.Params("poll_id")

	uid, userOk := c.Locals("uid").(string)
	if !userOk {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get identity",
		}
	}
	var pvs []models.PollVote
	var err error
	if uid != "" {
		pvs, err = models.GetPollVotesByUserId(pollId, uid)
	}

	if err != nil {
		fmt.Println(err)
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to validate votes",
		}
	}

	return c.JSON(fiber.Map{
		"votes":   pvs,
		"success": true,
	})
}
