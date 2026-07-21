package migrations

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func main() {
	mongoUri := getEnv("MONGODB_URI", "mongodb://localhost:27017")
	dbName := getEnv("MONGODB_DB", "portfolio")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
	if err != nil {
		log.Fatal(err)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatalf("failed to ping MongoDB: %v", err)
	}

	db := client.Database(dbName)

	if err := createIndexes(ctx, db); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Migration complete")
}

func createIndexes(ctx context.Context, db *mongo.Database) error {
	indexes := []struct {
		collection string
		keys       map[string]int
		unique     bool
	}{
		{"users", map[string]int{"email": 1}, true},
		{"projects", map[string]int{"slug": 1}, true},
		{"blogs", map[string]int{"slug": 1}, true},
	}

	for _, index := range indexes {
		collection := db.Collection(index.collection)
		keys := make(map[string]int)
		for field, direction := range index.keys {
			keys[field] = direction
		}
		_, err := collection.Indexes().CreateOne(ctx, mongo.IndexModel{
			Keys:    keys,
			Options: options.Index().SetUnique(index.unique),
		})
		if err != nil {
			return fmt.Errorf("create index on %s: %w", index.collection, err)
		}
	}

	return nil
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
