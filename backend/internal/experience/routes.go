package experience

import (
	"context"

	"portfolio-backend/internal/auth"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	collection *mongo.Collection
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{collection: db.Collection("experience")}
}

func (r *Repository) FindAll(ctx context.Context) ([]Experience, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var items []Experience
	if err := cursor.All(ctx, &items); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *Repository) Create(ctx context.Context, experience Experience) (*Experience, error) {
	result, err := r.collection.InsertOne(ctx, experience)
	if err != nil {
		return nil, err
	}
	experience.ID = result.InsertedID.(primitive.ObjectID).Hex()
	return &experience, nil
}

func (r *Repository) Update(ctx context.Context, id string, update bson.M) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": update})
	return err
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]Experience, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) Create(ctx context.Context, payload ExperienceRequest) (*Experience, error) {
	experience := Experience{
		Title:       payload.Title,
		Company:     payload.Company,
		DateRange:   payload.DateRange,
		Description: payload.Description,
		Tags:        payload.Tags,
	}
	return s.repo.Create(ctx, experience)
}

func (s *Service) Update(ctx context.Context, id string, payload ExperienceRequest) error {
	update := bson.M{
		"title":       payload.Title,
		"company":     payload.Company,
		"dateRange":   payload.DateRange,
		"description": payload.Description,
		"tags":        payload.Tags,
	}
	return s.repo.Update(ctx, id, update)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

type ExperienceRequest struct {
	Title       string   `json:"title" binding:"required"`
	Company     string   `json:"company" binding:"required"`
	DateRange   string   `json:"dateRange" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
}

func RegisterRoutes(router *gin.RouterGroup, db *mongo.Database) {
	repo := NewRepository(db)
	service := NewService(repo)

	router.GET("/experience", func(c *gin.Context) {
		items, err := service.GetAll(c.Request.Context())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, items)
	})

	admin := router.Group("/admin", auth.AuthMiddleware(), auth.AdminMiddleware())
	{
		admin.POST("/experience", func(c *gin.Context) {
			var payload ExperienceRequest
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			item, err := service.Create(c.Request.Context(), payload)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(201, item)
		})

		admin.PUT("/experience/:id", func(c *gin.Context) {
			var payload ExperienceRequest
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

		admin.DELETE("/experience/:id", func(c *gin.Context) {
			if err := service.Delete(c.Request.Context(), c.Param("id")); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})
	}
}
