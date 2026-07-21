package main

import (
	"log"

	"portfolio-backend/config"
	"portfolio-backend/internal/auth"
	"portfolio-backend/internal/blog"
	"portfolio-backend/internal/contact"
	"portfolio-backend/internal/project"

	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatalf("database unavailable, cannot start server: %v", err)
	}

	router := gin.Default()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" && (origin == "http://localhost:3000" || origin == "http://localhost:3001" || origin == "http://127.0.0.1:3000" || origin == "http://127.0.0.1:3001" || origin == "http://0.0.0.0:3000" || origin == "http://0.0.0.0:3001" || len(origin) >= 21 && origin[:21] == "http://localhost:300" || len(origin) >= 20 && origin[:20] == "http://127.0.0.1:300" || len(origin) >= 18 && origin[:18] == "http://0.0.0.0:300") {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := router.Group("/api")
	{
		auth.RegisterRoutes(api, db)
		blog.RegisterRoutes(api, db)
		contact.RegisterRoutes(api, db)
		project.RegisterRoutes(api, db)
	}

	port := config.GetPort()
	log.Printf("Starting server on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
