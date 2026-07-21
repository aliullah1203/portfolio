package blog

import (
	"database/sql"
	"portfolio-backend/internal/auth"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)

	router.GET("/blogs", func(c *gin.Context) {
		posts, err := service.GetAll(c.Request.Context())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, posts)
	})

	router.GET("/blogs/:slug", func(c *gin.Context) {
		post, err := service.GetBySlug(c.Request.Context(), c.Param("slug"))
		if err != nil {
			c.JSON(404, gin.H{"error": "blog not found"})
			return
		}
		if post == nil {
			c.JSON(404, gin.H{"error": "blog not found"})
			return
		}
		c.JSON(200, post)
	})

	router.GET("/blogs/:slug/reactions", func(c *gin.Context) {
		reactions, err := service.GetReactions(c.Request.Context(), c.Param("slug"))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, reactions)
	})

	router.POST("/blogs/:slug/reactions", func(c *gin.Context) {
		var payload BlogReactionRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		reactions, err := service.React(c.Request.Context(), c.Param("slug"), payload.ReactionType)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, reactions)
	})

	router.GET("/blogs/:slug/comments", func(c *gin.Context) {
		comments, err := service.GetComments(c.Request.Context(), c.Param("slug"))
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, comments)
	})

	router.POST("/blogs/:slug/comments", func(c *gin.Context) {
		var payload BlogCommentRequest
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		comment, err := service.AddComment(c.Request.Context(), BlogComment{
			BlogSlug:  c.Param("slug"),
			Author:    payload.Author,
			Text:      payload.Text,
			CreatedAt: "",
		})
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		if comment == nil {
			c.JSON(400, gin.H{"error": "comment text is required"})
			return
		}
		c.JSON(201, comment)
	})

	admin := router.Group("/admin", auth.AuthMiddleware(), auth.AdminMiddleware())
	{
		admin.POST("/blogs", func(c *gin.Context) {
			var payload BlogRequest
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			post, err := service.Create(c.Request.Context(), payload)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(201, post)
		})

		admin.PUT("/blogs/:id", func(c *gin.Context) {
			var payload BlogRequest
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			if err := service.Update(c.Request.Context(), c.Param("id"), payload); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})

		admin.DELETE("/blogs/:id", func(c *gin.Context) {
			if err := service.Delete(c.Request.Context(), c.Param("id")); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})
	}
}
