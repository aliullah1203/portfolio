package contact

import (
	"database/sql"
	"portfolio-backend/internal/auth"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, db *sql.DB) {
	router.POST("/contact", func(c *gin.Context) {
		if db == nil {
			c.JSON(503, gin.H{"error": "Database service unavailable. Please try again later."})
			return
		}

		var payload ContactRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		repo := NewRepository(db)
		service := NewService(repo)
		message, err := service.Create(c.Request.Context(), payload)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, message)
	})

	admin := router.Group("/admin", auth.AuthMiddleware(), auth.AdminMiddleware())
	{
		admin.GET("/messages", func(c *gin.Context) {
			if db == nil {
				c.JSON(503, gin.H{"error": "Database service unavailable"})
				return
			}

			repo := NewRepository(db)
			service := NewService(repo)
			messages, err := service.GetAll(c.Request.Context())
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(200, messages)
		})

		admin.DELETE("/messages/:id", func(c *gin.Context) {
			if db == nil {
				c.JSON(503, gin.H{"error": "Database service unavailable"})
				return
			}

			repo := NewRepository(db)
			service := NewService(repo)
			if err := service.Delete(c.Request.Context(), c.Param("id")); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})
	}
}
