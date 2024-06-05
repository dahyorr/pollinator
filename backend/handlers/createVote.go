package handlers

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/dahyorr/pollinator/database"
	"github.com/dahyorr/pollinator/models"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

type CreateVoteData struct {
	PollId        string   `json:"poll_id" validate:"required"`
	PollOptionId  string   `json:"poll_option" validate:"required_without=PollOptionIds"`
	PollOptionIds []string `json:"poll_options" validate:"required_without=PollOptionId"`
}

func CreateVote(c *fiber.Ctx) error {
	var body CreateVoteData
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"errors": err.Error(),
		})
	}

	errs := utils.Validation.Validate(body)
	if len(errs) > 0 {
		return utils.CreateRequestValidationErrorResponse(errs)
	}

	uid, userOk := c.Locals("uid").(string)
	if !userOk {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to check identity",
		}
	}

	poll, err := models.GetPollById(body.PollId, true)
	fmt.Println(body.PollId, err)
	if err != nil || poll.Status == "closed" {
		return &fiber.Error{
			Code:    fiber.StatusBadRequest,
			Message: "invalid poll id",
		}
	}
	// TODO:Validate OptionId is valid

	//	create transaction
	tx := database.DB.MustBegin()

	var result []*models.PollVote

	if body.PollOptionId != "" {

		pv := models.PollVote{
			PollId:       body.PollId,
			PollOptionId: body.PollOptionId,
			UserId:       sql.NullString{String: uid},
		}

		err := pv.Save(tx)
		if err != nil {
			return &fiber.Error{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to create vote",
			}
		}
		result = append(result, &pv)
	} else if len(body.PollOptionIds) > 0 && poll.MultipleChoice {
		pvs := make([]*models.PollVote, 0)
		for _, optionId := range body.PollOptionIds {
			pv := &models.PollVote{
				PollId:       body.PollId,
				PollOptionId: optionId,
				UserId:       sql.NullString{String: uid},
			}
			pvs = append(pvs, pv)
		}

		err := models.SavePollVotes(body.PollId, pvs, tx)

		if err != nil {
			return &fiber.Error{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to create vote",
			}
		}
		result = append(result, pvs...)
	} else {
		return &fiber.Error{
			Code:    fiber.StatusBadRequest,
			Message: "Provide poll_option id or poll_option",
		}
	}

	err = poll.IncrementPollResponse(1, tx)
	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to increment poll response",
		}
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println(err)
		return errors.New("failed to commit transaction")
	}

	return c.JSON(fiber.Map{
		"message": "Vote created successfully",
		"vote":    result,
	})

}
