package handlers

import "github.com/gofiber/fiber/v2"

func RegisterHandlers(app *fiber.App) {

	app.Post("/api/poll", CreatePoll)
}
