# 🏀 HoopScoop — Frontend

The React frontend for HoopScoop, a modern basketball blog platform. Built with **React 19**, **Vite**, and **React Router v7**, featuring cookie-based JWT auth, a post approval flow, role-based UI, and full responsiveness down to 320px.

**Live App:** https://hoopsqoop.vercel.app  
**Backend API:** https://basketball-blog-be.vercel.app

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Authentication System](#authentication-system)
- [Role-Based UI](#role-based-ui)
- [Key Components](#key-components)
- [Deploying to Vercel](#deploying-to-vercel)
- [Building for Production](#building-for-production)

---

## 🛠 Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Framework      | React 19                                 |
| Build Tool     | Vite 7                                   |
| Routing        | React Router DOM v7                      |
| Auth Storage   | `universal-cookie` (client-side cookies) |
| Token Decoding | `jwt-decode`                             |
| Notifications  | `react-hot-toast`                        |
| Icons          | `lucide-react`                           |
| Deployment     | Vercel (static + SPA routing)            |

---

## 📁 Project Structure

```
basketball-blog-frontend/
├── index.html                  # Root HTML — app mounts here
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel SPA routing fix (all paths → index.html)
├── .env                        # Local environment variables (never commit)
├── .env.production             # Production env vars (committed — public API URL only)
└── src/
    ├── main.jsx                # React entry point (wraps App in BrowserRouter)
    ├── App.jsx                 # Route definitions + auth guards
    ├── index.css               # Global design system (variables, base styles, responsive)
    ├── context/
    │   ├── AuthContext.jsx     # Auth state: user, token, loading, login(), logout()
    │   └── components/
    │       ├── Navbar.jsx      # Sticky nav with hamburger drawer (mobile)
    │       ├── Hero.jsx        # Home page hero section
    │       ├── BlogCard.jsx    # Post card for grid display
    │       ├── SkeletonCard.jsx# Loading placeholder for BlogCard
    │       ├── SearchBar.jsx   # Search input for filtering posts
    │       ├── Comments.jsx    # Comment list + add comment form
    │       └── StatusBadge.jsx # PENDING / APPROVED / REJECTED pill badge
    └── pages/
        ├── Landing.jsx         # Public landing page (logged-out visitors)
        ├── Home.jsx            # Main feed of approved posts (authenticated)
        ├── PostDetail.jsx      # Single post view with comments and likes
        ├── CreatePost.jsx      # Create a new post
        ├── EditPost.jsx        # Edit an existing post (author or admin)
        ├── MyPosts.jsx         # Current user's posts with status badges
        ├── AdminDashboard.jsx  # Approve/reject posts + manage user roles
        ├── Login.jsx           # Login form
        ├── Signup.jsx          # Registration form
        └── VerifyEmail.jsx     # OTP verification form (post-signup)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ and npm
- The backend API running locally or pointed to the live Vercel backend

### Installation

```bash
cd basketball-blog-frontend
npm install
cp .env.example .env   # then set VITE_API_URL=http://localhost:5000
```

### Running the Dev Server

```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 🔐 Environment Variables

| Variable       | Description                                     | Local dev value         |
| -------------- | ----------------------------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API (no trailing slash) | `http://localhost:5000` |

> All variables must be prefixed with `VITE_` to be accessible in the browser bundle.

### Production

`.env.production` is committed to git and automatically loaded by Vite during production builds:

```env
VITE_API_URL=https://basketball-blog-be.vercel.app
```

This guarantees the correct API URL is baked into every Vercel build without relying on dashboard env var timing.

---

## 🗺 Pages & Routes

| Path               | Component        | Guard         | Description                                                             |
| ------------------ | ---------------- | ------------- | ----------------------------------------------------------------------- |
| `/`                | `PublicHome`     | None          | Shows `Landing` if logged out, `Home` if logged in                      |
| `/home`            | `Home`           | Auth required | Post feed (APPROVED only for Users, all for Admins)                     |
| `/post/:id`        | `PostDetail`     | Auth required | Full post + comments + like toggle                                      |
| `/create`          | `CreatePost`     | Auth required | Create a new post                                                       |
| `/my-posts`        | `MyPosts`        | Auth required | Current user's posts with status badges                                 |
| `/edit/:id`        | `EditPost`       | Auth required | Edit a post (author or admin only)                                      |
| `/admin/dashboard` | `AdminDashboard` | Admin only    | Approve/reject posts + manage user roles                                |
| `/login`           | `Login`          | Public        | Email + password login                                                  |
| `/signup`          | `Signup`         | Public        | Registration form                                                       |
| `/verify-email`    | `VerifyEmail`    | Public        | OTP verification after signup                                           |
| `/scores`          | `Scores`         | Public        | Live NBA scores, upcoming games, and final results with date navigation |

### Route Guards

- **`ProtectedRoute`** — Redirects to `/login` if not authenticated.
- **`AdminRoute`** — Redirects to `/login` if unauthenticated, or `/` if not `ADMIN`.
- Both guards return `null` while auth state is rehydrated from cookie, preventing false redirects on refresh.

---

## 🔑 Authentication System

Auth state is managed in `AuthContext.jsx` and persisted via a browser cookie (`hoop_token`).

### `useAuth()` hook

| Property  | Type             | Description                                                   |
| --------- | ---------------- | ------------------------------------------------------------- |
| `user`    | `object \| null` | `{ id, email, role }` — `null` if not logged in               |
| `token`   | `string \| null` | Raw JWT string for attaching to API requests                  |
| `loading` | `boolean`        | `true` while reading cookie on first mount (prevents flick)   |
| `login`   | `function`       | `login(token)` — saves token to cookie and updates auth state |
| `logout`  | `function`       | Removes cookie and clears all auth state                      |

### Cookie Configuration

| Property | Value                                                   |
| -------- | ------------------------------------------------------- |
| Name     | `hoop_token`                                            |
| Max age  | 2 hours (matches JWT expiry)                            |
| SameSite | `lax`                                                   |
| Secure   | Auto — `true` on `https://` (Vercel), `false` on `http` |

### Rehydration on Refresh

On every page load, `AuthContext` reads the stored cookie, decodes the JWT with `jwt-decode`, validates `exp` against the current time, and restores the session — no network request needed.

### Making Authenticated API Calls

```js
const { token } = useAuth();

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 👥 Role-Based UI

| Feature                | USER                 | ADMIN                    |
| ---------------------- | -------------------- | ------------------------ |
| View posts             | APPROVED only        | All statuses             |
| Create post            | ✅ Goes to PENDING   | ✅ Published immediately |
| Edit own post          | ✅ Resets to PENDING | ✅ Keeps current status  |
| Delete own post        | ✅                   | ✅ Can delete any post   |
| Admin Dashboard link   | ❌ Hidden            | ✅ Visible in Navbar     |
| Approve / Reject posts | ❌                   | ✅                       |
| Promote / Demote users | ❌                   | ✅ (cannot demote self)  |

---

## 🧩 Key Components

### `Navbar.jsx`

Sticky top nav with role-aware links and the `LiveScores.jsx` horizontal scrolling ticker integrated below it. On mobile (≤768px), switches to a hamburger button that opens a slide-in drawer. Drawer closes automatically on route change.

### `LiveScores.jsx`

Horizontal scrolling NBA live scores ticker. Automatically fetches from the backend and polls every 60 seconds (with Page Visibility and AbortController optimizations).

### `BlogCard.jsx`

Post card displaying title, category, summary (2-line clamp), and author email. Linked to the full post detail page.

### `StatusBadge.jsx`

Color-coded pill: `PENDING` (yellow), `APPROVED` (green), `REJECTED` (red), `DRAFT` (grey).

### `AdminDashboard.jsx`

Two-tab panel:

- **Pending Posts** — Approve, Reject, or Delete each post with instant UI updates.
- **Users** — List all registered users, promote/demote between USER and ADMIN.

### `SkeletonCard.jsx`

Animated loading placeholder shown while posts are being fetched.

---

## 🚀 Deploying to Vercel

1. Push the repo to GitHub.
2. Import in [vercel.com](https://vercel.com) → set **Root Directory** to `basketball-blog-frontend`.
3. Vercel detects Vite automatically — no build command changes needed.
4. `vercel.json` handles SPA routing (all paths served from `index.html`):
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
5. `.env.production` (committed to git) bakes the production API URL into the bundle at build time — no dashboard env var needed for `VITE_API_URL`.

---

## 🏗 Building for Production

```bash
# Create optimised production bundle
npm run build

# Preview locally
npm run preview
```

Output is in `dist/`. The `VITE_API_URL` from `.env.production` is automatically used.
