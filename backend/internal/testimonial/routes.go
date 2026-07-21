package testimonial

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
	return &Repository{collection: db.Collection("testimonials")}
}

func (r *Repository) FindAll(ctx context.Context) ([]Testimonial, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var items []Testimonial
	if err := cursor.All(ctx, &items); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *Repository) Create(ctx context.Context, testimonial Testimonial) (*Testimonial, error) {
	result, err := r.collection.InsertOne(ctx, testimonial)
	if err != nil {
		return nil, err
	}
	testimonial.ID = result.InsertedID.(primitive.ObjectID).Hex()
	return &testimonial, nil
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

func (s *Service) GetAll(ctx context.Context) ([]Testimonial, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) Create(ctx context.Context, payload TestimonialRequest) (*Testimonial, error) {
	testimonial := Testimonial{
		Quote:        payload.Quote,
		Author:       payload.Author,
		Role:         payload.Role,
		Organization: payload.Organization,
	}
	return s.repo.Create(ctx, testimonial)
}

func (s *Service) Update(ctx context.Context, id string, payload TestimonialRequest) error {
	update := bson.M{
		"quote":        payload.Quote,
		"author":       payload.Author,
		"role":         payload.Role,
		"organization": payload.Organization,
	}
	return s.repo.Update(ctx, id, update)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

type TestimonialRequest struct {
	Quote        string `json:"quote" binding:"required"`
	Author       string `json:"author" binding:"required"`
	Role         string `json:"role" binding:"required"`
	Organization string `json:"organization" binding:"required"`
}

func RegisterRoutes(router *gin.RouterGroup, db *mongo.Database) {
	repo := NewRepository(db)
	service := NewService(repo)

	router.GET("/testimonials", func(c *gin.Context) {
		items, err := service.GetAll(c.Request.Context())
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, items)
	})

	admin := router.Group("/admin", auth.AuthMiddleware(), auth.AdminMiddleware())
	{
		admin.POST("/testimonials", func(c *gin.Context) {
			var payload TestimonialRequest
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

		admin.PUT("/testimonials/:id", func(c *gin.Context) {
			var payload TestimonialRequest
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

		admin.DELETE("/testimonials/:id", func(c *gin.Context) {
			if err := service.Delete(c.Request.Context(), c.Param("id")); err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.Status(204)
		})
	}
}
