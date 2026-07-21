package auth

import (
	"context"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo interface {
		FindByEmail(ctx context.Context, email string) (*User, error)
		CreateUser(ctx context.Context, user *User) error
	}
}

func NewService(repo interface {
	FindByEmail(ctx context.Context, email string) (*User, error)
	CreateUser(ctx context.Context, user *User) error
}) *Service {
	return &Service{repo: repo}
}

func (s *Service) Login(ctx context.Context, email, password string) (*TokenResponse, error) {
	if configuredEmail, configuredPassword := getConfiguredAdminCredentials(); configuredEmail != "" && configuredPassword != "" {
		if email == configuredEmail && password == configuredPassword {
			return generateTokens("admin", "admin")
		}
		return nil, ErrInvalidCredentials
	}

	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}
	return generateTokens(user.ID, user.Role)
}

func (s *Service) Register(ctx context.Context, email, password string) (*TokenResponse, error) {
	_, err := s.repo.FindByEmail(ctx, email)
	if err == nil {
		return nil, ErrUserAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &User{
		Email:    email,
		Password: string(hashedPassword),
		Role:     "admin",
	}
	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return generateTokens(user.ID, user.Role)
}

func (s *Service) RefreshToken(tokenString string) (*TokenResponse, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(getJwtSecret()), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}
	return generateTokens(claims.UserID, claims.Role)
}

func getConfiguredAdminCredentials() (string, string) {
	email := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")
	return email, password
}

func getJwtSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "supersecret"
	}
	return secret
}

func generateTokens(userID, role string) (*TokenResponse, error) {
	accessClaims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString([]byte(getJwtSecret()))
	if err != nil {
		return nil, err
	}
	refreshClaims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(getJwtSecret()))
	if err != nil {
		return nil, err
	}
	return &TokenResponse{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}
