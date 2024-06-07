package handlers

import (
	"time"

	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/guregu/null/v5"
)

type CreatePollData struct {
	Question       string        `json:"question" validate:"required"`
	Options        []string      `json:"options" validate:"required,min=2"`
	EndDate        null.Time     `json:"end_date" `
	Duration       time.Duration `json:"duration" `
	MultipleChoice bool          `json:"multiple_choice" validate:"boolean"`
	RequireAuth    bool          `json:"require_auth" validate:"boolean"`
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

	var endDate = body.EndDate
	if !body.EndDate.Valid && body.Duration > 0 {
		durationS := body.Duration * time.Second
		// endDate = utils.T{Time: time.Now().Add(durationS), Valid: true}
		endDate = null.TimeFrom(time.Now().Add(durationS))
	}

	uid, ok := c.Locals("uid").(string)
	if !ok {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get user id",
		}
	}

	var options []models.PollOption

	for _, option := range body.Options {
		options = append(options, models.PollOption{
			Text: option,
		})
	}

	poll := models.Poll{
		Question:       body.Question,
		MultipleChoice: body.MultipleChoice,
		EndDate:        endDate,
		RequireAuth:    body.RequireAuth,
		UserId:         uid,
		Options:        options,
	}

	err := poll.Save()

	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create poll",
		}
	}

	return c.JSON(poll)

}
