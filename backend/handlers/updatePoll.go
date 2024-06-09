package handlers

import (
	"fmt"

	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/guregu/null/v5"
)

type UpdatePollData struct {
	Id             string    `json:"id" validate:"required"`
	Question       string    `json:"question"`
	Options        []string  `json:"options"`
	EndDate        null.Time `json:"end_date"`
	MultipleChoice *bool     `json:"multiple_choice"`
	RequireAuth    *bool     `json:"require_auth"`
	Status         string    `json:"status"`
}

func UpdatePoll(c *fiber.Ctx) error {
	var body UpdatePollData

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"errors": err.Error(),
		})
	}

	errs := utils.Validation.Validate(body)
	if len(errs) > 0 {
		return utils.CreateRequestValidationErrorResponse(errs)
	}

	poll, err := models.GetPollById(body.Id, true)
	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusBadRequest,
			Message: "invalid poll id",
		}
	}

	uid, ok := c.Locals("uid").(string)
	if !ok {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get user id",
		}
	}

	if poll.UserId != uid {
		return &fiber.Error{
			Code:    fiber.StatusForbidden,
			Message: "You are not allowed to update this poll",
		}
	}

	if body.Question != "" {
		poll.Question = body.Question
	}
	fmt.Println(body)
	if body.EndDate.Valid {
		poll.EndDate = body.EndDate
	}

	if body.Status != "" {
		poll.Status = body.Status
	}

	if body.MultipleChoice != nil {
		poll.MultipleChoice = *body.MultipleChoice
	}

	if body.RequireAuth != nil {
		poll.RequireAuth = *body.RequireAuth
	}

	err = poll.Save()

	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create poll",
		}
	}

	return c.JSON(poll)

}
