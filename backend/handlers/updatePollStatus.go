package handlers

import (
	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

type UpdatePollStatusData struct {
	PollId string `json:"poll_id" validate:"required"`
	Status string `json:"status" validate:"required,oneof=open closed"`
}

func UpdatePollStatus(c *fiber.Ctx) error {
	var body UpdatePollStatusData
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"errors": err.Error(),
		})
	}
	errs := utils.Validation.Validate(body)
	if len(errs) > 0 {
		return utils.CreateRequestValidationErrorResponse(errs)
	}

	poll, err := models.GetPollById(body.PollId, true)

	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusBadRequest,
			Message: "invalid poll id",
		}
	}

	poll.UpdatePollStatus(body.Status)

	return c.JSON(fiber.Map{
		"message": "Poll status updated successfully",
	})
}
