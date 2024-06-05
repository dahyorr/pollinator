package middlewares

import (
	"log"
	"strings"

	"github.com/dahyorr/pollinator/utils"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(hmacSecret string, allowUnauthorized bool) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		authToken := ctx.Get("Authorization")
		print(allowUnauthorized)

		if authToken == "" && !allowUnauthorized {
			return fiber.ErrUnauthorized
		} else if authToken == "" && allowUnauthorized {
			return ctx.Next()
		}
		splitToken := strings.Split(authToken, "Bearer ")
		if len(splitToken) != 2 {
			return fiber.ErrUnauthorized
		}
		token := splitToken[1]
		if token == "" {
			return fiber.ErrUnauthorized
		}
		uid, email, err := utils.ParseJWTToken(token, []byte(hmacSecret))
		if err != nil {
			log.Printf("Error parsing token: %s", err)
			return fiber.ErrUnauthorized
		}
		print(uid)
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
