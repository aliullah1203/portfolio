package config

import "testing"

func TestGetDatabaseURL(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgresql://primary")
	if got := GetDatabaseURL(); got != "postgresql://primary" {
		t.Fatalf("expected explicit DATABASE_URL to be used, got %q", got)
	}
}

func TestGetDatabaseURLUsesLegacyEnvFallback(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	t.Setenv("POSTGRES_URL", "postgresql://legacy")
	if got := GetDatabaseURL(); got != "postgresql://legacy" {
		t.Fatalf("expected POSTGRES_URL fallback, got %q", got)
	}
}

func TestGetDatabaseName(t *testing.T) {
	t.Setenv("MONGODB_DB", "custom-db")
	if got := GetDatabaseName(); got != "custom-db" {
		t.Fatalf("expected configured database name, got %q", got)
	}
}

func TestGetDatabaseURLUsesNeonEnv(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgresql://neon:test@db.example.com/neon")
	if got := GetDatabaseURL(); got != "postgresql://neon:test@db.example.com/neon" {
		t.Fatalf("expected DATABASE_URL to be used, got %q", got)
	}
}
