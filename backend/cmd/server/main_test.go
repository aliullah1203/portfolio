package main

import "testing"

func TestIsAllowedOrigin(t *testing.T) {
	tests := []struct {
		name   string
		origin string
		want   bool
	}{
		{name: "localhost", origin: "http://localhost:3000", want: true},
		{name: "localhost with trailing slash", origin: "http://localhost:3000/", want: true},
		{name: "vercel", origin: "https://portfolio-6ghej4rri-aliullah.vercel.app", want: true},
		{name: "vercel with trailing slash", origin: "https://portfolio-6ghej4rri-aliullah.vercel.app/", want: true},
		{name: "workers", origin: "https://portfolio.aliullah0301.workers.dev", want: true},
		{name: "workers with trailing slash", origin: "https://portfolio.aliullah0301.workers.dev/", want: true},
		{name: "blocked", origin: "https://example.com", want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isAllowedOrigin(tt.origin); got != tt.want {
				t.Fatalf("isAllowedOrigin(%q) = %v, want %v", tt.origin, got, tt.want)
			}
		})
	}
}
