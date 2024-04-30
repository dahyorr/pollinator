package middlewares

import (
	"log"

	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(hmacSecret string) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		token := ctx.Get("Authorization")
		if token == "" {
			return fiber.ErrUnauthorized
		}
		uid, email, err := utils.ParseJWTToken(token, []byte(hmacSecret))
		if err != nil {
			log.Printf("Error parsing token: %s", err)
			return fiber.ErrUnauthorized
		}

		ctx.Locals("uid", uid)
		ctx.Locals("email", email)

		return ctx.Next()
	}

	// authToken := ctx.Cookies(utils.Config.SessionCookieName)
	// session, err := models.GetSessionByToken(authToken)

	// if err != nil || session.IsExpired() {
	// return fiber.ErrUnauthorized
	// }
	// ctx.Locals("session", session)
	// ctx.Locals("user_Id", session.UserId)
}
