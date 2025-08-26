# Fender Auth API — Node.js + Express + JWT + Prisma + SQLite

Token-based user authentication API. JSON in/out.

## Stack & Rationale
Node.js (Express) for speed and clarity; JWT (Bearer) for token auth; Prisma + SQLite for zero-config DB.

## Models 
User: id, name, email (unique), passwordHash, createdAt, updatedAt
RevokedToken: id, jti (unique), expiresAt, revokedAt

## Endpoints
POST /api/users/register — create user {name,email,password}
POST /api/auth/login — returns {token_type,expires_in,access_token}
POST /api/auth/logout — revoke current token (Bearer) → 204
GET /api/users/me — current user (Bearer)
PATCH /api/users/me — update {name?,email?,password?} (Bearer)
DELETE /api/users/me — delete self (Bearer)

## Quick Start
```bash
# 1) Install
npm install

# 2) Environment
cp .env.example .env
# set JWT_SECRET (strong), optional PORT, JWT_EXPIRES_IN

# 3) DB (Prisma + SQLite)
npx prisma generate
npm run db:push

# 4) Run
npm run dev   # or: npm start
# -> http://localhost:3000

## For HealthCheck use:
curl http://localhost:3000/health
