package contact

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, message ContactMessage) (*ContactMessage, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	query := `
		INSERT INTO contacts (name, email, subject, message, created_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`
	var id int64
	err := r.db.QueryRowContext(ctx, query, message.Name, message.Email, message.Subject, message.Message, time.Now().UTC()).Scan(&id)
	if err != nil {
		return nil, err
	}

	message.ID = strconv.FormatInt(id, 10)
	return &message, nil
}

func (r *Repository) FindAll(ctx context.Context) ([]ContactMessage, error) {
	if err := r.ensureTable(ctx); err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, name, email, subject, message, created_at
		FROM contacts
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []ContactMessage
	for rows.Next() {
		var created time.Time
		var msg ContactMessage
		if err := rows.Scan(&msg.ID, &msg.Name, &msg.Email, &msg.Subject, &msg.Message, &created); err != nil {
			return nil, err
		}
		msg.Created = created.Format(time.RFC3339)
		messages = append(messages, msg)
	}
	return messages, rows.Err()
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	if err := r.ensureTable(ctx); err != nil {
		return err
	}

	_, err := r.db.ExecContext(ctx, `DELETE FROM contacts WHERE id = $1`, id)
	return err
}

func (r *Repository) ensureTable(ctx context.Context) error {
	_, err := r.db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS contacts (
			id BIGSERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			subject TEXT NOT NULL,
			message TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		)
	`)
	if err != nil {
		return fmt.Errorf("ensure contacts table: %w", err)
	}
	return nil
}
