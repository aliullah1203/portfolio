package blog

import (
	"context"
	"regexp"
	"strings"
	"time"
)

type repository interface {
	FindAll(ctx context.Context) ([]BlogPost, error)
	FindBySlug(ctx context.Context, slug string) (*BlogPost, error)
	Create(ctx context.Context, blog BlogPost) (*BlogPost, error)
	Update(ctx context.Context, id string, update map[string]interface{}) error
	Delete(ctx context.Context, id string) error
	GetReactions(ctx context.Context, slug string) ([]BlogReaction, error)
	UpsertReaction(ctx context.Context, slug string, reactionType string) ([]BlogReaction, error)
	GetComments(ctx context.Context, slug string) ([]BlogComment, error)
	CreateComment(ctx context.Context, comment BlogComment) (*BlogComment, error)
}

type Service struct {
	repo repository
}

func NewService(repo repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]BlogPost, error) {
	posts, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	filtered := make([]BlogPost, 0, len(posts))
	for _, post := range posts {
		if isPublished(post.Status) {
			filtered = append(filtered, post)
		}
	}
	return filtered, nil
}

func (s *Service) GetBySlug(ctx context.Context, slug string) (*BlogPost, error) {
	post, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if post == nil || !isPublished(post.Status) {
		return nil, nil
	}
	return post, nil
}

func (s *Service) Create(ctx context.Context, payload BlogRequest) (*BlogPost, error) {
	blog := BlogPost{
		Slug:            payload.Slug,
		Title:           payload.Title,
		Excerpt:         payload.Excerpt,
		Content:         payload.Content,
		PublishedAt:     payload.PublishedAt,
		Category:        payload.Category,
		ReadTime:        payload.ReadTime,
		CoverImage:      payload.CoverImage,
		Tags:            payload.Tags,
		MetaTitle:       payload.MetaTitle,
		MetaDescription: payload.MetaDescription,
		Status:          payload.Status,
		Featured:        payload.Featured,
		AllowComments:   payload.AllowComments,
	}
	if blog.Slug == "" {
		blog.Slug = slugify(blog.Title)
	}
	if blog.PublishedAt == "" {
		blog.PublishedAt = currentTimestamp()
	}
	if blog.Category == "" {
		blog.Category = "Development"
	}
	if blog.ReadTime == "" {
		blog.ReadTime = "5 min read"
	}
	if blog.CoverImage == "" {
		blog.CoverImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
	}
	if blog.Status == "" {
		blog.Status = "published"
	}
	return s.repo.Create(ctx, blog)
}

func (s *Service) Update(ctx context.Context, id string, payload BlogRequest) error {
	update := map[string]interface{}{
		"slug":            payload.Slug,
		"title":           payload.Title,
		"excerpt":         payload.Excerpt,
		"content":         payload.Content,
		"publishedAt":     payload.PublishedAt,
		"category":        payload.Category,
		"readTime":        payload.ReadTime,
		"coverImage":      payload.CoverImage,
		"tags":            payload.Tags,
		"metaTitle":       payload.MetaTitle,
		"metaDescription": payload.MetaDescription,
		"status":          payload.Status,
		"featured":        payload.Featured,
		"allowComments":   payload.AllowComments,
	}
	return s.repo.Update(ctx, id, update)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *Service) GetReactions(ctx context.Context, slug string) ([]BlogReaction, error) {
	return s.repo.GetReactions(ctx, slug)
}

func (s *Service) React(ctx context.Context, slug string, reactionType string) ([]BlogReaction, error) {
	return s.repo.UpsertReaction(ctx, slug, reactionType)
}

func (s *Service) GetComments(ctx context.Context, slug string) ([]BlogComment, error) {
	return s.repo.GetComments(ctx, slug)
}

func (s *Service) AddComment(ctx context.Context, comment BlogComment) (*BlogComment, error) {
	if comment.Author == "" {
		comment.Author = "Anonymous"
	}
	if comment.Text == "" {
		return nil, nil
	}
	if comment.CreatedAt == "" {
		comment.CreatedAt = currentTimestamp()
	}
	return s.repo.CreateComment(ctx, comment)
}

func slugify(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	re := regexp.MustCompile(`[^a-z0-9]+`)
	value = re.ReplaceAllString(value, "-")
	value = strings.Trim(value, "-")
	if value == "" {
		return "post"
	}
	return value
}

func isPublished(status string) bool {
	status = strings.ToLower(strings.TrimSpace(status))
	if status == "" {
		return true
	}
	if status == "archived" || status == "archive" {
		return false
	}
	return status == "published" || status == "publish" || status == "active" || status == "draft"
}

func currentTimestamp() string {
	return time.Now().UTC().Format(time.RFC3339)
}
