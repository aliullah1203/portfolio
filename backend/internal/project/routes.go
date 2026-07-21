package project

import (
	"database/sql"
	"portfolio-backend/internal/auth"
	"regexp"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)

	router.GET("/projects", func(c *gin.Context) {
		items, err := service.GetAll(c.Request.Context())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, items)
	})

	router.GET("/projects/featured", func(c *gin.Context) {
		items, err := service.GetFeatured(c.Request.Context())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, items)
	})

	router.GET("/projects/:slug", func(c *gin.Context) {
		project, err := service.GetBySlug(c.Request.Context(), c.Param("slug"))
		if err != nil {
			c.JSON(404, gin.H{"error": "project not found"})
			return
		}
		c.JSON(200, project)
	})

	admin := router.Group("/admin", auth.AuthMiddleware(), auth.AdminMiddleware())
	{
		admin.POST("/projects", func(c *gin.Context) {
			if db == nil {
				c.JSON(503, gin.H{"error": "database unavailable"})
				return
			}
			var payload ProjectRequest
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			if ok, _ := regexp.MatchString(`^[a-zA-Z0-9-]+$`, payload.Slug); !ok {
				c.JSON(400, gin.H{"error": "slug must contain only letters, numbers, and dashes"})
				return
			}
			item, err := service.Create(c.Request.Context(), payload)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(201, item)
		})

		admin.PUT("/projects/:id", func(c *gin.Context) {
			var payload ProjectRequest
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			if ok, _ := regexp.MatchString(`^[a-zA-Z0-9-]+$`, payload.Slug); !ok {
				c.JSON(400, gin.H{"error": "slug must contain only letters, numbers, and dashes"})
				return
			}
			if err := service.Update(c.Request.Context(), c.Param("id"), payload); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})

		admin.DELETE("/projects/:id", func(c *gin.Context) {
			if err := service.Delete(c.Request.Context(), c.Param("id")); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})
	}
}
