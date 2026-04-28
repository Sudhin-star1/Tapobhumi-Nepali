# Tapobhumi Nepali Darshan — Dynamic Web App

This repo contains:

- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui
- **Backend**: Node.js + Express (MVC)
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: Admin-only JWT authentication
- **Uploads**: Multer + Cloudinary (Gallery + Package images)

## Quick start (local)

### 1) Configure environment variables

Create these files:

- **Frontend**: `.env`
- **Backend**: `server/.env`

Use the provided examples:

- `.env.example`
- `server/.env.example`

**Important**: never commit `.env` files (already gitignored).

### 2) Install dependencies

```bash
npm install
cd server && npm install
```

### 3) Seed database (creates admin + initial content)

```bash
cd server
npm run seed
```

### 4) Run frontend + backend together

From repo root:

```bash
npm run dev:all
```

- Frontend: `http://localhost:8080`
- API: `http://localhost:5000/api/health`

## Admin panel

- URL: `/admin/login`
- Login: from your seed values (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)

## API endpoints

- `POST /api/auth/login`
- `GET /api/packages` (supports `?featured=true`)
- `CRUD /api/services`
- `CRUD /api/treks`
- `CRUD /api/tours`
- `CRUD /api/gallery` (multipart upload `image`)
- `GET/PUT /api/contact`

