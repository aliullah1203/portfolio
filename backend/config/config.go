package config

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Load() {
	path, err := findDotEnv()
	if err != nil {
		log.Println(".env file not found, loading environment variables from system")
		return
	}

	if err := godotenv.Load(path); err != nil {
		log.Printf("failed to load .env file %s: %v", path, err)
	}
}

func findDotEnv() (string, error) {
	candidates := []string{
		".env",
		"backend/.env",
		"./backend/.env",
		"../backend/.env",
	}

	for _, candidate := range candidates {
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}

	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for dir := wd; dir != filepath.Dir(dir); dir = filepath.Dir(dir) {
		candidate := filepath.Join(dir, "backend", ".env")
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}

	return "", errors.New(".env file not found")
}

func GetDatabaseURL() string {
	if uri := os.Getenv("DATABASE_URL"); uri != "" {
		return normalizeDatabaseURL(uri)
	}
	if uri := os.Getenv("POSTGRES_URL"); uri != "" {
		return normalizeDatabaseURL(uri)
	}
	if uri := os.Getenv("MONGODB_URI"); uri != "" {
		return normalizeDatabaseURL(uri)
	}
	if uri := os.Getenv("MONGODB_URL"); uri != "" {
		return normalizeDatabaseURL(uri)
	}
	return "postgres://postgres:postgres@localhost:5432/portfolio"
}

func normalizeDatabaseURL(uri string) string {
	if uri == "" {
		return uri
	}
	if len(uri) > 0 && uri[:4] == "postgres" {
		if uri[len(uri)-1:] != "?" && !contains(uri, "sslmode=") {
			return uri + "?sslmode=require"
		}
	}
	return uri
}

func contains(s, substr string) bool {
	return len(substr) == 0 || (len(s) >= len(substr) && (s == substr || (len(s) > len(substr) && (contains(s[1:], substr) || s[:len(substr)] == substr))))
}

func GetDatabaseName() string {
	if name := os.Getenv("MONGODB_DB"); name != "" {
		return name
	}
	return "portfolio"
}

func GetPort() string {
	if port := os.Getenv("PORT"); port != "" {
		return port
	}
	return "8080"
}

func ConnectDB() (*sql.DB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	db, err := sql.Open("postgres", GetDatabaseURL())
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	DB = db
	return DB, nil
}
