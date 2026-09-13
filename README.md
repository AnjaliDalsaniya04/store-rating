# StoreRate — Store Rating Application

A full-stack web application where users can browse and rate stores, store owners can monitor their ratings, and admins can manage the entire platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Axios, Vite |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcryptjs |
| Validation | Zod |

---

## Features

### 👤 User
- Register and log in
- Browse all stores with average ratings
- Submit or update a rating (1–5 stars) for any store
- Change password

### 🏪 Store Owner
- View their own store details
- See all submitted ratings and the average score
- Change password

### 🛡️ Admin
- Dashboard with total users, stores, and ratings stats
- View, search, and filter all users
- View user details including their submitted ratings
- Add new stores and assign them to store owners
- View and manage all stores
- Change password

---

## Project Structure

```
store-rating/
├── backend/
│   ├── prisma/          # Schema and migrations
│   ├── src/
│   │   ├── config/      # Prisma client setup
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # JWT auth middleware
│   │   ├── routes/      # Express routers
│   │   └── utils/       # Validators
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # Axios client
    │   ├── components/  # Shared UI components
    │   ├── context/     # Auth and Toast context
    │   ├── pages/       # Page components per role
    │   └── utils/       # Frontend validation
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/AnjaliDalsaniya04/store-rating.git
cd store-rating
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/store_rating_db"
JWT_SECRET="your_long_random_secret"
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/signup` | Public |
| POST | `/auth/login` | Public |
| PUT | `/auth/update-password` | Authenticated |
| GET | `/user/stores` | User |
| POST | `/user/ratings` | User |
| PUT | `/user/ratings/:storeId` | User |
| GET | `/owner/dashboard` | Store Owner |
| GET | `/admin/stats` | Admin |
| GET | `/admin/users` | Admin |
| GET | `/admin/stores` | Admin |
| POST | `/admin/stores` | Admin |

---

## Default Roles

Roles are assigned as follows:

- **USER** — anyone who signs up via the registration page
- **STORE_OWNER** — assigned by an Admin when creating a store
- **ADMIN** — set directly in the database

---

## License

MIT
