package project

import "testing"

func TestNormalizeProjectRequestUsesSafeDefaults(t *testing.T) {
	payload := ProjectRequest{
		Slug:        "demo-project",
		Title:       "Demo Project",
		Description: "A demo project",
	}

	normalized := normalizeProjectRequest(payload)

	if normalized.Thumbnail != "" {
		t.Fatalf("expected empty thumbnail, got %q", normalized.Thumbnail)
	}
	if normalized.Technologies == nil {
		t.Fatalf("expected technologies slice to be initialized")
	}
}
