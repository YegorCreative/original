# Original Actions — Setup Guide

A premium spiritual rhythm and habit-tracking app for prayer, Scripture, reflection, and meaningful daily actions.

## Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## Project Structure

```
original/
├── backend/           # Express.js server
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/    # API routes
│   │   ├── middleware/
│   │   └── controllers/
│   ├── db/
│   │   └── schema.sql # Database schema
│   └── package.json
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Setup PostgreSQL Database**
```bash
# Create a new database
createdb original_actions

# Load the schema
psql original_actions < ../db/schema.sql
```

3. **Configure environment**
Create a `.env` file:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/original_actions
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

4. **Start the server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:habitId` - Get habit details
- `POST /api/habits/:habitId/log` - Log habit completion
- `DELETE /api/habits/:habitId` - Delete habit

### User
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics

## Features

### Current MVP
- ✅ Auth flow (login, signup, guest mode)
- ✅ Create and manage daily spiritual habits
- ✅ Log daily habit completion
- ✅ Prayer timer with haptic feedback
- ✅ Weekly rhythm score (7-day grid)
- ✅ Grace-based encouragement messaging
- ✅ Community rhythm leaderboard

### Planned Features
- 🔄 Scripture reading tracker with passage prompts
- 🔄 Reflection journal with daily writing prompts
- 🔄 Prayer request list with answered prayer log
- 🔄 Gentle push notification reminders
- 🔄 Offline support (PWA)
- 🔄 React Native / Expo conversion

## Development Notes

- All API requests require JWT authentication (except auth endpoints)
- Passwords are hashed using bcryptjs
- CORS is configured for the frontend URL
- Database uses PostgreSQL with proper indexing

## Troubleshooting

**Database connection error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env matches your setup

**Port already in use:**
- Backend: Change PORT in .env
- Frontend: Change vite config port

**CORS errors:**
- Ensure FRONTEND_URL in backend .env matches your frontend URL
