# 📚 Study Tracker

A full-stack study task manager with **MongoDB + Prisma**, **JWT authentication**, and **role-based access** (admin vs guest).

| Tech | Version |
|---|---|
| **Next.js** | 15.3 (App Router + Turbopack) |
| **React** | 19.1 |
| **Tailwind CSS** | v4.1 (CSS-first config) |
| **Prisma** | 6.6 (MongoDB adapter) |
| **bcryptjs** | 3.x |
| **jsonwebtoken** | 9.x |
| **react-icons** | 5.5 |
| **date-fns** | 4.1 |

---

## 🔐 Auth Model

| Role | Can do |
|---|---|
| **Guest** | View all tasks, filter, search |
| **Admin** | Everything — create, edit, complete, delete tasks |



## 🗂️ Project Structure

```
study-tracker/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js    # POST — returns JWT
│   │   │   ├── logout/route.js   # POST — clears cookie
│   │   │   └── me/route.js       # GET  — verify session
│   │   └── tasks/
│   │       ├── route.js          # GET (public) · POST (admin)
│   │       └── [id]/route.js     # GET (public) · PATCH · DELETE (admin)
│   ├── globals.css               # Tailwind v4 @theme config
│   ├── layout.jsx                # Root layout + AuthProvider
│   └── page.jsx                  # Main dashboard page
│
├── components/                   # ← Outside app/ (Next.js convention)
│   ├── AddTaskModal.jsx
│   ├── EmptyState.jsx
│   ├── FilterBar.jsx
│   ├── Header.jsx                # Auth-aware header
│   ├── LoginModal.jsx            # Admin login modal
│   ├── StatsBar.jsx
│   ├── TaskCard.jsx              # Role-gated action buttons
│   ├── TaskList.jsx
│   └── UpcomingAlert.jsx
│
├── hooks/                        # ← Outside app/
│   ├── useAuth.js                # AuthContext + login/logout
│   ├── useTasks.js               # CRUD via /api/tasks
│   └── useTheme.js               # Dark/light mode
│
├── lib/                          # ← Outside app/
│   ├── auth.js                   # JWT helpers + admin creds
│   ├── constants.js              # Task types, colors, priorities
│   ├── prisma.js                 # Singleton PrismaClient
│   └── utils.js                  # Sort, countdown, format helpers
│
├── prisma/
│   └── schema.prisma             # MongoDB schema
│
├── .env                          # Secret config (never commit!)
├── .env.example                  # Safe template to commit
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json                 # @ alias → project root
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

---


## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Login with username/password → JWT |
| POST | `/api/auth/logout` | None | Clear auth cookie |
| GET | `/api/auth/me` | Token | Get current user |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | None (public) | List all tasks. Query: `?type=exam&completed=false&search=keyword` |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/:id` | None (public) | Get single task |
| PATCH | `/api/tasks/:id` | Admin | Update task fields |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

**Admin auth:** Pass `Authorization: Bearer <token>` header or the `auth_token` cookie.

---

## 🎨 Tailwind v4 Notes
- No `tailwind.config.js` — all theme in `app/globals.css` under `@theme {}`
- Import: `@import "tailwindcss"` (not old `@tailwind` directives)
- Dark mode: `@variant dark (&:where(.dark, .dark *))`
- PostCSS: `@tailwindcss/postcss` (autoprefixer built-in)

---

## 📄 License
MIT © StudyTracker
