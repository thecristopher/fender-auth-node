# Fender Auth API — Node.js + Express + JWT + Prisma + SQLite

Token-based user authentication API. JSON in/out.

## Stack & Rationale
Node.js (Express) for speed and clarity; JWT (Bearer) for token auth; Prisma + SQLite for zero-config DB.

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

