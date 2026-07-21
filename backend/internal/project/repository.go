package project

import (
	"context"
	"database/sql"
	"encoding/json"
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

func scanProject(scanner interface {
	Scan(dest ...interface{}) error
}) (Project, error) {
	var item Project
	var created time.Time
	var thumbnail sql.NullString
	var technologiesJSON sql.NullString
	var liveURL sql.NullString
	var githubURL sql.NullString
	if err := scanner.Scan(&item.ID, &item.Slug, &item.Title, &item.Description, &thumbnail, &technologiesJSON, &liveURL, &githubURL, &item.Featured, &created); err != nil {
		return Project{}, err
	}
	item.Thumbnail = thumbnail.String
	item.LiveURL = liveURL.String
	item.GitHubURL = githubURL.String
	if technologiesJSON.Valid && technologiesJSON.String != "" {
		raw := []byte(technologiesJSON.String)
		if json.Valid(raw) {
			if err := json.Unmarshal(raw, &item.Technologies); err != nil {
				return Project{}, err
			}
		} else {
			item.Technologies = []string{}
		}
	} else {
		item.Technologies = []string{}
	}
	return item, nil
}

func (r *Repository) FindAll(ctx context.Context) ([]Project, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, slug, title, description, thumbnail, technologies, live_url, github_url, featured, created_at
		FROM projects
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Project
	for rows.Next() {
		item, err := scanProject(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *Repository) FindFeatured(ctx context.Context) ([]Project, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, slug, title, description, thumbnail, technologies, live_url, github_url, featured, created_at
		FROM projects
		WHERE featured = TRUE
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Project
	for rows.Next() {
		item, err := scanProject(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *Repository) FindBySlug(ctx context.Context, slug string) (*Project, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	item, err := scanProject(r.db.QueryRowContext(ctx, `
		SELECT id, slug, title, description, thumbnail, technologies, live_url, github_url, featured, created_at
		FROM projects
		WHERE slug = $1
	`, slug))
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *Repository) Create(ctx context.Context, project Project) (*Project, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	techValue, err := json.Marshal(project.Technologies)
	if err != nil {
		return nil, fmt.Errorf("marshal technologies: %w", err)
	}

	project.ID = uuid.NewString()
	query := `
		INSERT INTO projects (id, slug, title, description, thumbnail, technologies, live_url, github_url, featured, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`
	var id string
	err = r.db.QueryRowContext(ctx, query, project.ID, project.Slug, project.Title, project.Description, project.Thumbnail, string(techValue), project.LiveURL, project.GitHubURL, project.Featured, time.Now().UTC()).Scan(&id)
	if err != nil {
		return nil, err
	}
	project.ID = id
	return &project, nil
}

func (r *Repository) Update(ctx context.Context, id string, update map[string]interface{}) error {
	if err := r.ensureTable(ctx); err != nil {
		return err
	}

	techValue, err := json.Marshal(update["technologies"])
	if err != nil {
		return fmt.Errorf("marshal technologies: %w", err)
	}

	_, err = r.db.ExecContext(ctx, `
		UPDATE projects
		SET slug = $1, title = $2, description = $3, thumbnail = $4, technologies = $5, live_url = $6, github_url = $7, featured = $8
		WHERE id = $9
	`, update["slug"], update["title"], update["description"], update["thumbnail"], string(techValue), update["liveUrl"], update["githubUrl"], update["featured"], id)
	return err
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	if err := r.ensureTable(ctx); err != nil {
		return err
	}

	_, err := r.db.ExecContext(ctx, `DELETE FROM projects WHERE id = $1`, id)
	return err
}

func (r *Repository) ensureTable(ctx context.Context) error {
	_, err := r.db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS projects (
			id TEXT PRIMARY KEY,
			slug TEXT NOT NULL UNIQUE,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			thumbnail TEXT,
			technologies TEXT,
			live_url TEXT,
			github_url TEXT,
			featured BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		)
	`)
	if err != nil {
		return fmt.Errorf("ensure projects table: %w", err)
	}
	return nil
}
