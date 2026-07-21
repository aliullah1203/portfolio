package auth

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

// RefreshTokenRequest represents the payload for token refresh
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func RegisterRoutes(router *gin.RouterGroup, db *sql.DB) {
	authRepo := NewRepository()
	authService := NewService(authRepo)

	router.POST("/auth/login", func(c *gin.Context) {
		var payload LoginRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		tokenResponse, err := authService.Login(c.Request.Context(), payload.Email, payload.Password)
		if err != nil {
			c.JSON(401, gin.H{"error": "invalid credentials"})
			return
		}
		c.JSON(200, tokenResponse)
	})

	optionsHandler := func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "http://localhost:3000" || origin == "http://localhost:3001" || origin == "http://127.0.0.1:3000" || origin == "http://127.0.0.1:3001" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Status(204)
	}

	router.OPTIONS("/auth/login", optionsHandler)
	router.OPTIONS("/auth/register", optionsHandler)
	router.OPTIONS("/auth/refresh", optionsHandler)

	router.POST("/auth/register", func(c *gin.Context) {
		var payload RegisterRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		tokenResponse, err := authService.Register(c.Request.Context(), payload.Email, payload.Password)
		if err != nil {
			if err == ErrUserAlreadyExists {
				c.JSON(409, gin.H{"error": err.Error()})
				return
			}
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, tokenResponse)
	})

	router.POST("/auth/refresh", func(c *gin.Context) {
		var payload RefreshTokenRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		tokenResponse, err := authService.RefreshToken(payload.RefreshToken)
		if err != nil {
			c.JSON(401, gin.H{"error": "invalid refresh token"})
			return
		}
		c.JSON(200, tokenResponse)
	})
}
