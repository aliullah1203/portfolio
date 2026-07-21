package analytics

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, db *mongo.Database) {
	router.GET("/analytics/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
