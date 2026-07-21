package blog

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll(ctx context.Context) ([]BlogPost, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, slug, title, excerpt, content, published_at, category, read_time, cover_image, COALESCE(tags, ''), COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(status, 'draft'), featured, allow_comments, created_at
		FROM blogs
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []BlogPost
	for rows.Next() {
		var item BlogPost
		var publishedAt time.Time
		var createdAt time.Time
		if err := rows.Scan(&item.ID, &item.Slug, &item.Title, &item.Excerpt, &item.Content, &publishedAt, &item.Category, &item.ReadTime, &item.CoverImage, &item.Tags, &item.MetaTitle, &item.MetaDescription, &item.Status, &item.Featured, &item.AllowComments, &createdAt); err != nil {
			return nil, err
		}
		item.PublishedAt = publishedAt.Format(time.RFC3339)
		posts = append(posts, item)
	}
	return posts, rows.Err()
}

func (r *Repository) FindBySlug(ctx context.Context, slug string) (*BlogPost, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	var item BlogPost
	var publishedAt time.Time
	var createdAt time.Time
	err := r.db.QueryRowContext(ctx, `
		SELECT id, slug, title, excerpt, content, published_at, category, read_time, cover_image, COALESCE(tags, ''), COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(status, 'draft'), featured, allow_comments, created_at
		FROM blogs
		WHERE slug = $1
	`, slug).Scan(&item.ID, &item.Slug, &item.Title, &item.Excerpt, &item.Content, &publishedAt, &item.Category, &item.ReadTime, &item.CoverImage, &item.Tags, &item.MetaTitle, &item.MetaDescription, &item.Status, &item.Featured, &item.AllowComments, &createdAt)
	if err != nil {
		return nil, err
	}
	item.PublishedAt = publishedAt.Format(time.RFC3339)
	return &item, nil
}

func (r *Repository) Create(ctx context.Context, blog BlogPost) (*BlogPost, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	blog.ID = uuid.NewString()
	publishedAt, err := time.Parse(time.RFC3339, blog.PublishedAt)
	if err != nil {
		publishedAt = time.Now().UTC()
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO blogs (id, slug, title, excerpt, content, published_at, category, read_time, cover_image, tags, meta_title, meta_description, status, featured, allow_comments, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`, blog.ID, blog.Slug, blog.Title, blog.Excerpt, blog.Content, publishedAt, blog.Category, blog.ReadTime, blog.CoverImage, blog.Tags, blog.MetaTitle, blog.MetaDescription, blog.Status, blog.Featured, blog.AllowComments, time.Now().UTC())
	if err != nil {
		return nil, err
	}
	return &blog, nil
}

func (r *Repository) Update(ctx context.Context, id string, update map[string]interface{}) error {
	if err := r.ensureTable(ctx); err != nil {
		return err
	}

	_, err := r.db.ExecContext(ctx, `
		UPDATE blogs
		SET slug = $1, title = $2, excerpt = $3, content = $4, published_at = $5, category = $6, read_time = $7, cover_image = $8, tags = $9, meta_title = $10, meta_description = $11, status = $12, featured = $13, allow_comments = $14
		WHERE id = $15
	`, update["slug"], update["title"], update["excerpt"], update["content"], update["publishedAt"], update["category"], update["readTime"], update["coverImage"], update["tags"], update["metaTitle"], update["metaDescription"], update["status"], update["featured"], update["allowComments"], id)
	return err
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	if err := r.ensureTable(ctx); err != nil {
		return err
	}

	_, err := r.db.ExecContext(ctx, `DELETE FROM blogs WHERE id = $1`, id)
	return err
}

func (r *Repository) GetReactions(ctx context.Context, slug string) ([]BlogReaction, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT blog_slug, reaction_type, count
		FROM blog_reactions
		WHERE blog_slug = $1
		ORDER BY reaction_type
	`, slug)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reactions []BlogReaction
	for rows.Next() {
		var reaction BlogReaction
		if err := rows.Scan(&reaction.BlogSlug, &reaction.ReactionType, &reaction.Count); err != nil {
			return nil, err
		}
		reactions = append(reactions, reaction)
	}
	return reactions, rows.Err()
}

func (r *Repository) UpsertReaction(ctx context.Context, slug string, reactionType string) ([]BlogReaction, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	_, err := r.db.ExecContext(ctx, `
		INSERT INTO blog_reactions (blog_slug, reaction_type, count)
		VALUES ($1, $2, 1)
		ON CONFLICT (blog_slug, reaction_type) DO UPDATE SET count = blog_reactions.count + 1
	`, slug, reactionType)
	if err != nil {
		return nil, err
	}
	return r.GetReactions(ctx, slug)
}

func (r *Repository) GetComments(ctx context.Context, slug string) ([]BlogComment, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, blog_slug, author, text, created_at
		FROM blog_comments
		WHERE blog_slug = $1
		ORDER BY created_at ASC
	`, slug)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []BlogComment
	for rows.Next() {
		var comment BlogComment
		var createdAt time.Time
		if err := rows.Scan(&comment.ID, &comment.BlogSlug, &comment.Author, &comment.Text, &createdAt); err != nil {
			return nil, err
		}
		comment.CreatedAt = createdAt.Format(time.RFC3339)
		comments = append(comments, comment)
	}
	return comments, rows.Err()
}

func (r *Repository) CreateComment(ctx context.Context, comment BlogComment) (*BlogComment, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	comment.ID = uuid.NewString()
	createdAt, err := time.Parse(time.RFC3339, comment.CreatedAt)
	if err != nil {
		createdAt = time.Now().UTC()
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO blog_comments (id, blog_slug, author, text, created_at)
		VALUES ($1, $2, $3, $4, $5)
	`, comment.ID, comment.BlogSlug, comment.Author, comment.Text, createdAt)
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *Repository) ensureTable(ctx context.Context) error {
	_, err := r.db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS blogs (
			id TEXT PRIMARY KEY,
			slug TEXT NOT NULL UNIQUE,
			title TEXT NOT NULL,
			excerpt TEXT NOT NULL,
			content TEXT NOT NULL,
			published_at TIMESTAMP NOT NULL DEFAULT NOW(),
			category TEXT NOT NULL,
			read_time TEXT NOT NULL,
			cover_image TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT;
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title TEXT;
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT;
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
		ALTER TABLE blogs ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN NOT NULL DEFAULT true;
		CREATE TABLE IF NOT EXISTS blog_reactions (
			blog_slug TEXT NOT NULL,
			reaction_type TEXT NOT NULL,
			count INTEGER NOT NULL DEFAULT 0,
			PRIMARY KEY (blog_slug, reaction_type)
		);
		CREATE TABLE IF NOT EXISTS blog_comments (
			id TEXT PRIMARY KEY,
			blog_slug TEXT NOT NULL,
			author TEXT NOT NULL,
			text TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);
	`)
	if err != nil {
		return fmt.Errorf("ensure blogs table: %w", err)
	}
	return nil
}
