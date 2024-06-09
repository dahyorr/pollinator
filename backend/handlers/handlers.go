package handlers

import (
	"github.com/dahyorr/pollinator/middlewares"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

func RegisterHandlers(app *fiber.App, config *utils.ConfigInst) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	restrictedRoutes := app.Group("")
	restrictedRoutes.Use(middlewares.AuthMiddleware(config.JWTSecret, true))
	restrictedRoutes.Post("/api/poll", CreatePoll)
	restrictedRoutes.Post("/api/vote", CreateVote)
	restrictedRoutes.Get("/api/poll/:poll_id/votes", GetVotes)
	restrictedRoutes.Put("/api/poll/:poll_id", UpdatePoll)

	// nonRestrictedRoutes := app.Group("")
	// nonRestrictedRoutes.Use(middlewares.AuthMiddleware(config.JWTSecret, true))
}
