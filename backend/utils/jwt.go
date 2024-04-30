package utils

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func ParseJWTToken(token string, hmacSecret []byte) (uid string, email string, err error) {
	// Parse the token and validate the signature
	t, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return hmacSecret, nil
	})

	// Check if the token is valid
	if err != nil {
		return "", "", fmt.Errorf("error validating token: %v", err)
	} else if claims, ok := t.Claims.(*Claims); ok {
		return claims.Subject, claims.Email, nil
	}

	return "", "", fmt.Errorf("error parsing token: %v", err)
}
