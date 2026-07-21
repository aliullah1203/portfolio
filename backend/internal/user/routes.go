package user

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, db *mongo.Database) {
	// User routes can be added here once authentication and profile management are implemented.
	router.GET("/users/me", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "user profile endpoint placeholder"})
	})
}
