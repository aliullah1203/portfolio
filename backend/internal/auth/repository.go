package auth

import (
	"context"
	"sync"
)

type Repository struct {
	mu    sync.RWMutex
	users map[string]*User
}

func NewRepository() *Repository {
	return &Repository{users: make(map[string]*User)}
}

func (r *Repository) FindByEmail(ctx context.Context, email string) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, ok := r.users[email]
	if !ok {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (r *Repository) CreateUser(ctx context.Context, user *User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.users[user.Email] = user
	return nil
}

func (r *Repository) FindByID(ctx context.Context, id string) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.users {
		if user.ID == id {
			return user, nil
		}
	}
	return nil, ErrUserNotFound
}
