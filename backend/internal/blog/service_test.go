package blog

import (
	"context"
	"testing"
)

type stubRepository struct {
	posts []BlogPost
}

func (s *stubRepository) FindAll(ctx context.Context) ([]BlogPost, error) {
	return s.posts, nil
}

func (s *stubRepository) FindBySlug(ctx context.Context, slug string) (*BlogPost, error) {
	for _, post := range s.posts {
		if post.Slug == slug {
			return &post, nil
		}
	}
	return nil, nil
}

func (s *stubRepository) Create(ctx context.Context, blog BlogPost) (*BlogPost, error) {
	return &blog, nil
}

func (s *stubRepository) Update(ctx context.Context, id string, update map[string]interface{}) error {
	return nil
}

func (s *stubRepository) Delete(ctx context.Context, id string) error {
	return nil
}

func (s *stubRepository) GetReactions(ctx context.Context, slug string) ([]BlogReaction, error) {
	return nil, nil
}

func (s *stubRepository) UpsertReaction(ctx context.Context, slug string, reactionType string) ([]BlogReaction, error) {
	return nil, nil
}

func (s *stubRepository) GetComments(ctx context.Context, slug string) ([]BlogComment, error) {
	return nil, nil
}

func (s *stubRepository) CreateComment(ctx context.Context, comment BlogComment) (*BlogComment, error) {
	return &comment, nil
}

func TestServiceGetAllReturnsNonArchivedPosts(t *testing.T) {
	repo := &stubRepository{posts: []BlogPost{
		{Slug: "draft-post", Status: "draft"},
		{Slug: "published-post", Status: "published"},
		{Slug: "archived-post", Status: "archived"},
	}}

	service := NewService(repo)
	posts, err := service.GetAll(context.Background())
	if err != nil {
		t.Fatalf("GetAll returned error: %v", err)
	}

	if len(posts) != 2 {
		t.Fatalf("expected 2 non-archived posts, got %d", len(posts))
	}

	if posts[0].Slug != "draft-post" || posts[1].Slug != "published-post" {
		t.Fatalf("expected draft and published posts, got %q and %q", posts[0].Slug, posts[1].Slug)
	}
}

func TestServiceGetBySlugReturnsDraftPostsUnlessArchived(t *testing.T) {
	repo := &stubRepository{posts: []BlogPost{{Slug: "draft-post", Status: "draft"}}}
	service := NewService(repo)

	post, err := service.GetBySlug(context.Background(), "draft-post")
	if err != nil {
		t.Fatalf("expected no error for draft lookup, got %v", err)
	}
	if post == nil {
		t.Fatal("expected draft post to be returned")
	}
}

func TestServiceCreateDefaultsToPublishedStatus(t *testing.T) {
	repo := &stubRepository{}
	service := NewService(repo)

	created, err := service.Create(context.Background(), BlogRequest{Title: "Hello", Slug: "hello"})
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}
	if created == nil {
		t.Fatal("expected created post, got nil")
	}
	if created.Status != "published" {
		t.Fatalf("expected published status, got %q", created.Status)
	}
}
