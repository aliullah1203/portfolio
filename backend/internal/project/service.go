package project

import (
	"context"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]Project, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) GetFeatured(ctx context.Context) ([]Project, error) {
	return s.repo.FindFeatured(ctx)
}

func (s *Service) GetBySlug(ctx context.Context, slug string) (*Project, error) {
	return s.repo.FindBySlug(ctx, slug)
}

func (s *Service) Create(ctx context.Context, payload ProjectRequest) (*Project, error) {
	normalized := normalizeProjectRequest(payload)
	project := Project{
		Slug:         normalized.Slug,
		Title:        normalized.Title,
		Description:  normalized.Description,
		Thumbnail:    normalized.Thumbnail,
		Technologies: normalized.Technologies,
		LiveURL:      normalized.LiveURL,
		GitHubURL:    normalized.GitHubURL,
		Featured:     normalized.Featured,
	}
	return s.repo.Create(ctx, project)
}

func (s *Service) Update(ctx context.Context, id string, payload ProjectRequest) error {
	normalized := normalizeProjectRequest(payload)
	update := map[string]interface{}{
		"slug":         normalized.Slug,
		"title":        normalized.Title,
		"description":  normalized.Description,
		"thumbnail":    normalized.Thumbnail,
		"technologies": normalized.Technologies,
		"liveUrl":      normalized.LiveURL,
		"githubUrl":    normalized.GitHubURL,
		"featured":     normalized.Featured,
	}
	return s.repo.Update(ctx, id, update)
}

func normalizeProjectRequest(payload ProjectRequest) ProjectRequest {
	if payload.Technologies == nil {
		payload.Technologies = []string{}
	}
	if payload.Thumbnail == "" {
		payload.Thumbnail = ""
	}
	return payload
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
