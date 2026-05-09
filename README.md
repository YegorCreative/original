# Original Actions

**Return to what matters.**

Original Actions helps you build gentle daily rhythms through prayer, Scripture, reflection, and meaningful actions — rooted in grace instead of pressure.

---

## App Overview

Original Actions is a premium spiritual habit-tracking app for Christians who want to grow in faith through consistent, daily practice. The focus is on gentleness, not performance. On returning, not perfecting. On grace, not guilt.

---

## Core Features

- **Prayer habits** — Log and time your daily prayer sessions
- **Scripture reading** — Track Bible reading with a daily passage prompt
- **Evening reflection** — Journal what God is teaching you today
- **Meaningful actions** — Track acts of service and encouragement
- **Weekly rhythm score** — A gentle consistency view (not a streak weapon)
- **Grace messaging** — "Grace meets you here. Begin again today." when you miss a day
- **Prayer timer** — Built-in timer with haptic feedback (1, 3, 5, 10, 15 min)
- **Community rhythm** — See how others are showing up this week
- **Guest mode** — Try the app instantly without signing up

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | Plain CSS with CSS custom properties (dark mode design system) |
| HTTP | Axios |
| Backend | Node.js, Express |
| Auth | JWT (jsonwebtoken ^9.0.0) |
| Database | PostgreSQL (via `pg`) |
| Dev server | Nodemon |

---

## Design Direction

- Premium dark mode (`#0a0f1e` deep navy base)
- Soft gold (`#c9a96e`) as the primary accent
- Warm cream (`#f0ead6`) for text
- Muted green (`#4a9474`) for completion states
- Glass-style cards with subtle borders
- Sticky header, fixed bottom navigation
- Mobile-first, max-width 680px content column
- No guilt-based language anywhere in the UI

---

## Local Setup

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/original_actions
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

Load the database schema:

```bash
psql original_actions < db/schema.sql
```

Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:3000`. The frontend proxies all `/api/*` requests to the backend on port 5000.

> **Guest mode** works without the backend — all data is mocked locally.

---

## Folder Structure

```
original/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express entry point
│   │   ├── db.js             # PostgreSQL connection
│   │   ├── routes/           # auth, habits, users, leaderboard
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   │       └── streak.js
│   ├── db/
│   │   └── schema.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Router + AuthContext
│   │   ├── index.css         # Global dark mode design system + CSS vars
│   │   ├── pages/
│   │   │   ├── Login.jsx / Auth.css
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx / Dashboard.css
│   │   ├── components/
│   │   │   ├── PrayerTimer.jsx / PrayerTimer.css
│   │   │   ├── StreakBadge.jsx / StreakBadge.css
│   │   │   └── Leaderboard.jsx / Leaderboard.css
│   │   └── context/
│   │       └── AuthContext.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Current Development Status

- [x] Auth flow (login, signup, guest mode)
- [x] Dashboard with habit cards
- [x] Prayer timer with haptic feedback
- [x] Streak badge per habit
- [x] Community rhythm leaderboard (with offline fallback)
- [x] Weekly rhythm score (7-day grid)
- [x] Bottom navigation
- [x] Grace messaging (no guilt language)
- [x] Premium dark mode design system
- [ ] Bible reading tracker with passage links
- [ ] Reflection journal with prompts
- [ ] Prayer request list
- [ ] Answered prayer log
- [ ] Push notification reminders
- [ ] Offline support (PWA)

---

## Future Roadmap

1. **Bible reading tracker** — daily passage with YouVersion / ESV API integration
2. **Reflection journal** — prompted entries with local storage persistence
3. **Prayer request list** — add, organize, and mark answered prayers
4. **Reminder preferences** — gentle, customizable daily notification times
5. **Offline / PWA support** — full offline habit logging
6. **Cloud sync** — real-time sync across devices
7. **Accountability partners** — share rhythm with a trusted person

---

## React Native / Expo Migration Plan

The component structure is designed for a straightforward conversion to React Native. Planned native screens:

| Web Component | React Native Screen / Component |
|---|---|
| `Login.jsx` / `Signup.jsx` | `AuthScreen` |
| `Dashboard.jsx` | `DashboardScreen` |
| Habit card (inner JSX) | `HabitCard` component |
| Weekly rhythm section | `RhythmScore` component |
| Bottom nav | `BottomTabNavigator` (React Navigation) |
| `PrayerTimer.jsx` | `PrayerScreen` with `PrayerTimer` component |
| Future: journal page | `JournalScreen` |
| Future: prayer list | `PrayerListScreen` |
| Future: settings | `SettingsScreen` |

CSS variables map directly to a React Native `theme.ts` constants file. Card styles translate to `StyleSheet` objects. The `AuthContext` pattern works identically in React Native.

---

## License

MIT — use freely, build gracefully.
