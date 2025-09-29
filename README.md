# CarbonChain

A platform for creating, validating, trading, and tracking carbon credit projects.

## Tech Stack
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React (Vite), Tailwind CSS, Framer Motion, Recharts, React Router

## Prerequisites
- Node.js 20.19+ (or 22.12+)
- PostgreSQL (local install or Docker Desktop)

## Quick Start

### 1) Database
- Option A: Docker (after installing Docker Desktop)
  - `cd infra`
  - `docker compose up -d`
- Option B: Local PostgreSQL
  - Create database `carbonchain` and user `carbon/carbonpass` (or adjust `DATABASE_URL`).

### 2) Backend
```bash
cd backend
# create .env
# WINDOWS POWERSHELL:
# ni .env -ItemType File; ac .env "PORT=4000"; ac .env "DATABASE_URL=postgresql://carbon:carbonpass@localhost:5432/carbonchain?schema=public"; ac .env "JWT_SECRET=replace_me"

npm install
npm run prisma:migrate
npm run dev
```
- API base URL: `http://localhost:4000`

### 3) Frontend
```bash
cd frontend
# create .env
# ni .env -ItemType File; ac .env "VITE_API_URL=http://localhost:4000"

npm install
npm run dev
```
- Vite runs at `http://localhost:5173`

## Seed (optional)
You can register users via API:
- POST `/api/auth/register` with `{ email, password, fullName, role }` where role is `CREATOR|VALIDATOR|BUYER|ADMIN`.
- Login at `/api/auth/login` to get a JWT.

## Core Endpoints
- Auth: `/api/auth/register`, `/api/auth/login`
- Projects: `/api/projects` (POST creator), `/api/projects` (GET all), `/api/projects/mine` (GET creator)
- Validations: `/api/validations/pending` (GET validator), `/api/validations/:projectId/decide` (POST validator)
- Transactions: `/api/transactions/purchase` (POST buyer), `/api/transactions/mine` (GET buyer)

## Notes
- Ensure Node.js version satisfies Vite: 20.19+.
- If Docker isn’t installed, run a local Postgres and update `DATABASE_URL`.

