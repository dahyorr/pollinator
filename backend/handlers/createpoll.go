package handlers

import (
	"time"

	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

type CreatePollData struct {
	Question       string    `json:"question" validate:"required"`
	Answers        []string  `json:"answers" validate:"required,min=2"`
	EndDate        time.Time `json:"end_date" `
	MultipleChoice bool      `json:"multiple_choice" validate:"boolean"`
}

func CreatePoll(c *fiber.Ctx) error {
	var body CreatePollData

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"errors": err.Error(),
		})
	}

	errs := utils.Validation.Validate(body)
	if len(errs) > 0 {
		return utils.CreateRequestValidationErrorResponse(errs)
	}

	poll_settings := models.PollSettings{
		MultipleChoice: body.MultipleChoice,
		EndDate:        body.EndDate,
	}
	poll, err := models.NewPoll(body.Question, body.Answers, &poll_settings)

	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create poll",
		}
	}

	return c.JSON(poll)

}
