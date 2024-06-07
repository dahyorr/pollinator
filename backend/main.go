package main

import (
	"fmt"

	"github.com/dahyorr/pollinator/database"
	"github.com/dahyorr/pollinator/handlers"
	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Your code here
	config := utils.InitConfig()
	dbErr := database.Init(config)

	if dbErr != nil {
		panic(dbErr)
	}
	fmt.Println("Connected to db...")

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusBadRequest).JSON(utils.GlobalErrorHandlerResp{
				Success: false,
				Message: err.Error(),
			})
		},
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))
	app.Use(recover.New())

	handlers.RegisterHandlers(app, config)

	err := app.Listen(fmt.Sprintf(":%v", config.PORT))
	if err != nil {
		panic(err)
	}
}
