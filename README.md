# Portfolio Platform

Professional portfolio platform built with Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, TanStack Query, Go Gin backend, MongoDB Atlas, and AWS deployment configuration.

## Structure

- `frontend/` - Next.js app with App Router and FSD structure
- `backend/` - Go Gin API with clean architecture modules
- `config/` - Nginx, PM2, GitHub Actions, SSL and deployment configuration
- `docs/` - Deployment and infrastructure guide

## Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd ../backend
   go mod tidy
   ```

3. Configure environment variables for frontend and backend.

4. Run frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. Run backend:
   ```bash
   cd backend
   go run ./cmd/server
   ```
