package contact

import (
	"context"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, payload ContactRequest) (*ContactMessage, error) {
	message := ContactMessage{
		Name:    payload.Name,
		Email:   payload.Email,
		Subject: payload.Subject,
		Message: payload.Message,
		Created: time.Now().Format(time.RFC3339),
	}
	return s.repo.Create(ctx, message)
}

func (s *Service) GetAll(ctx context.Context) ([]ContactMessage, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
