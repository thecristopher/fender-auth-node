# Fender Auth API — Node.js + Express + JWT + Prisma + SQLite

Token-based user authentication API. JSON in/out.

---

## 1) Why this stack (fit for the challenge)
- **Node.js + Express**: fast, readable, interview-friendly.
- **SQLite**: zero external deps; identical setup across OSes.
- **Prisma**: clean schema + type-safe client; portable to Postgres/MySQL later.
- **JWT (Bearer)**: matches “token-based” requirement; simple stateless auth. Logout handled by revoking token `jti` until expiry.

---

## 2) Requirements mapping (from the prompt)
**Models**
- `User`: `name`, `email`, `password` (stored as `passwordHash`), plus ids/timestamps.
- `RevokedToken`: `jti`, `expiresAt`, `revokedAt` (for logout deny-list).

**Endpoints** (user-centric)
1) **Register** — `POST /api/users/register`  
2) **Login** — `POST /api/auth/login` → returns token envelope  
3) **Logout** — `POST /api/auth/logout`  
4) **Update current user** — `PATCH /api/users/me`  
5) **Delete current user** — `DELETE /api/users/me`  
(+ **Me**: `GET /api/users/me`, and `GET /health`)

All requests/responses are JSON.


## 3) Quick Start

~~~bash
# 1) Install deps
npm install

# 2) Environment
cp .env.example .env
# set a strong JWT_SECRET, optionally PORT and JWT_EXPIRES_IN

# 3) DB (Prisma + SQLite)
npx prisma generate
npm run db:push

# 4) Run
npm run dev   # or: npm start
# -> http://localhost:3000
~~~

Health check:
~~~bash
curl http://localhost:3000/health
# {"status":"ok"}
~~~

---

## 4) Environment variables
~~~dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-please"
JWT_EXPIRES_IN="15m"   # e.g., 15m, 1h, 7d
PORT=3000
~~~

---

## 5) Database (Prisma + SQLite)
- Schema lives in `prisma/schema.prisma`.
- Create/update DB: `npm run db:push`
- Regenerate client after schema changes: `npx prisma generate`
- Switch DB (e.g., Postgres) by changing `provider` + `DATABASE_URL`, then run migrations.

**Models**
- **User**: `id`, `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
- **RevokedToken**: `id`, `jti` (unique), `expiresAt`, `revokedAt`

---

## 6) API Reference (JSON only)

### 6.1 Register
**POST** `/api/users/register`  
Body:
~~~json
{ "name": "Cris", "email": "cris@example.com", "password": "secret123" }
~~~
**201 Created**
~~~json
{ "id": 1, "name": "Cris", "email": "cris@example.com", "createdAt": "..." }
~~~
Errors: `400` missing fields, `409` email already in use.

### 6.2 Login (token-based)
**POST** `/api/auth/login`  
Body:
~~~json
{ "email": "cris@example.com", "password": "secret123" }
~~~
**200 OK**
~~~json
{
  "token_type": "Bearer",
  "expires_in": 900,
  "access_token": "<JWT>"
}
~~~
Errors: `400` or `401`.

### 6.3 Authenticated endpoints (require `Authorization: Bearer <token>`)
**GET** `/api/users/me` → current profile  
**PATCH** `/api/users/me` → update `name?`, `email?`, `password?`  
**DELETE** `/api/users/me` → delete self

### 6.4 Logout (deny-list)
**POST** `/api/auth/logout` → **204 No Content**  
Revokes the current token’s `jti` until its natural expiration. Further use of the same token returns **401**.

---

## 7) Minimal cURL flow

~~~bash
# Register
curl -s -X POST http://localhost:3000/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Cris","email":"cris@example.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"cris@example.com","password":"secret123"}' | jq -r .access_token)

# Me
curl -s http://localhost:3000/api/users/me -H "Authorization: Bearer $TOKEN"

# Update
curl -s -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Cris Fender"}'

# Logout
curl -i -X POST http://localhost:3000/api/auth/logout -H "Authorization: Bearer $TOKEN"

# Try token again (should be 401)
curl -i http://localhost:3000/api/users/me -H "Authorization: Bearer $TOKEN"
~~~

---
