package handlers

import (
	"github.com/dahyorr/pollinator/middlewares"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

func RegisterHandlers(app *fiber.App, config *utils.ConfigInst) {

	restrictedRoutes := app.Group("")
	restrictedRoutes.Use(middlewares.AuthMiddleware(config.JWTSecret, true))
	restrictedRoutes.Post("/api/poll", CreatePoll)
	restrictedRoutes.Post("/api/vote", CreateVote)
	restrictedRoutes.Get("/api/poll/:poll_id/votes", GetVotes)

	// nonRestrictedRoutes := app.Group("")
	// nonRestrictedRoutes.Use(middlewares.AuthMiddleware(config.JWTSecret, true))
}
