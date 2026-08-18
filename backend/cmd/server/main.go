package main

import (
	"log"
	"strings"

	"portfolio-backend/config"
	"portfolio-backend/internal/auth"
	"portfolio-backend/internal/blog"
	"portfolio-backend/internal/contact"
	"portfolio-backend/internal/project"

	"github.com/gin-gonic/gin"
)

func isAllowedOrigin(origin string) bool {
	if origin == "" {
		return false
	}

	normalizedOrigin := strings.TrimRight(origin, "/")
	if normalizedOrigin == "" {
		return false
	}

	allowedOrigins := map[string]bool{
		"http://localhost:3000":                           true,
		"http://localhost:3001":                           true,
		"http://localhost:3002":                           true,
		"http://127.0.0.1:3000":                           true,
		"http://127.0.0.1:3001":                           true,
		"http://127.0.0.1:3002":                           true,
		"http://0.0.0.0:3000":                             true,
		"http://0.0.0.0:3001":                             true,
		"http://0.0.0.0:3002":                             true,
		"https://portfolio-6ghej4rri-aliullah.vercel.app": true,
		"https://portfolio.aliullah0301.workers.dev":      true,
	}

	if allowedOrigins[normalizedOrigin] {
		return true
	}

	return strings.HasSuffix(normalizedOrigin, ".vercel.app") || strings.HasSuffix(normalizedOrigin, ".workers.dev") || strings.HasSuffix(normalizedOrigin, ".pages.dev")
}

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
		if isAllowedOrigin(origin) {
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
