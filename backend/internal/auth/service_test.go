package auth

import (
	"context"
	"testing"

	"go.mongodb.org/mongo-driver/mongo"
)

type stubRepo struct {
	users map[string]*User
}

func (r *stubRepo) FindByEmail(ctx context.Context, email string) (*User, error) {
	user, ok := r.users[email]
	if !ok {
		return nil, mongo.ErrNoDocuments
	}
	return user, nil
}

func (r *stubRepo) CreateUser(ctx context.Context, user *User) error {
	r.users[user.Email] = user
	return nil
}

func TestRegisterCreatesAdminUserAndHashesPassword(t *testing.T) {
	repo := &stubRepo{users: map[string]*User{}}
	service := NewService(repo)

	token, err := service.Register(context.Background(), "admin@example.com", "secret123")
	if err != nil {
		t.Fatalf("Register returned unexpected error: %v", err)
	}
	if token.AccessToken == "" || token.RefreshToken == "" {
		t.Fatalf("expected tokens to be generated")
	}

	createdUser := repo.users["admin@example.com"]
	if createdUser == nil {
		t.Fatalf("expected user to be stored")
	}
	if createdUser.Role != "admin" {
		t.Fatalf("expected admin role, got %q", createdUser.Role)
	}
	if createdUser.Password == "secret123" {
		t.Fatalf("expected password to be hashed")
	}
}

func TestRegisterRejectsDuplicateEmail(t *testing.T) {
	repo := &stubRepo{users: map[string]*User{}}
	service := NewService(repo)

	_, err := service.Register(context.Background(), "admin@example.com", "secret123")
	if err != nil {
		t.Fatalf("first registration should succeed: %v", err)
	}

	_, err = service.Register(context.Background(), "admin@example.com", "another-password")
	if err != ErrUserAlreadyExists {
		t.Fatalf("expected ErrUserAlreadyExists, got %v", err)
	}
}

func TestLoginAcceptsConfiguredAdminCredentialsFromEnv(t *testing.T) {
	t.Setenv("ADMIN_EMAIL", "ali@example.com")
	t.Setenv("ADMIN_PASSWORD", "secret123")

	repo := &stubRepo{users: map[string]*User{}}
	service := NewService(repo)

	token, err := service.Login(context.Background(), "ali@example.com", "secret123")
	if err != nil {
		t.Fatalf("Login returned unexpected error: %v", err)
	}
	if token.AccessToken == "" || token.RefreshToken == "" {
		t.Fatalf("expected tokens to be generated")
	}
}
