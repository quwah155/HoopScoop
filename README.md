# 🏀 HoopScoop — Frontend

The React frontend for HoopScoop, a modern basketball blog platform. Built with **React 19**, **Vite**, and **React Router v7**, featuring JWT auth (httpOnly-style cookies), a post approval flow, and an admin dashboard.

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
| Linting        | ESLint with React Hooks plugin           |

---

## 📁 Project Structure

```
basketball-blog-frontend/
├── index.html                  # Root HTML — app mounts here
├── vite.config.js              # Vite configuration
├── .env                        # Local environment variables (never commit)
├── .env.example                # Template for environment variables
├── src/
│   ├── main.jsx                # React entry point (wraps App in BrowserRouter)
│   ├── App.jsx                 # Route definitions + auth guards
│   ├── index.css               # Global design system (variables, base styles)
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state: user, token, loading, login(), logout()
│   │   └── components/
│   │       ├── Navbar.jsx      # Top navigation bar (role-aware links)
│   │       ├── Hero.jsx        # Home page hero section
│   │       ├── BlogCard.jsx    # Post card for grid/list display
│   │       ├── SkeletonCard.jsx# Loading placeholder for BlogCard
│   │       ├── SearchBar.jsx   # Search input for filtering posts
│   │       └── StatusBadge.jsx # Color-coded PENDING/APPROVED/REJECTED badge
│   └── pages/
│       ├── Landing.jsx         # Public landing page (shown to logged-out visitors)
│       ├── Home.jsx            # Main feed of approved posts (authenticated)
│       ├── PostDetail.jsx      # Single post view with comments and likes
│       ├── CreatePost.jsx      # Create a new post (all authenticated users)
│       ├── EditPost.jsx        # Edit an existing post (author or admin)
│       ├── MyPosts.jsx         # Current user's own posts list
│       ├── AdminDashboard.jsx  # Admin panel: pending posts + user management
│       ├── Login.jsx           # Login form
│       ├── Signup.jsx          # Registration form
│       └── VerifyEmail.jsx     # OTP verification form (post-signup)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ and npm
- The backend API server running (see [backend README](../basketball-blog-BE/README.md))

### Installation

```bash
# Navigate to the frontend directory
cd basketball-blog-frontend

# Install dependencies
npm install

# Copy the environment template and fill in your values
cp .env.example .env
```

### Running the Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

---

## 🔐 Environment Variables

| Variable       | Description                                     | Example                 |
| -------------- | ----------------------------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API (no trailing slash) | `http://localhost:5000` |

> For production deployment, update `VITE_API_URL` to your deployed backend URL. All variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 🗺 Pages & Routes

| Path               | Component        | Guard         | Description                                               |
| ------------------ | ---------------- | ------------- | --------------------------------------------------------- |
| `/`                | `PublicHome`     | None          | Shows `Landing` if logged out, `Home` if logged in        |
| `/home`            | `Home`           | Auth required | Post feed (APPROVED posts only for Users, all for Admins) |
| `/post/:id`        | `PostDetail`     | Auth required | Full post + comments + like button                        |
| `/create`          | `CreatePost`     | Auth required | Create a new post                                         |
| `/my-posts`        | `MyPosts`        | Auth required | Current user's posts with status badges                   |
| `/edit/:id`        | `EditPost`       | Auth required | Edit a post (author or admin only)                        |
| `/admin/dashboard` | `AdminDashboard` | Admin only    | Approve/reject posts + manage user roles                  |
| `/login`           | `Login`          | Public        | Email + password login                                    |
| `/signup`          | `Signup`         | Public        | Registration form                                         |
| `/verify-email`    | `VerifyEmail`    | Public        | OTP verification after signup                             |

### Route Guards

- **`ProtectedRoute`** — Redirects to `/login` if user is not authenticated.
- **`AdminRoute`** — Redirects to `/login` if not authenticated, or `/` if role is not `ADMIN`.
- Both guards return `null` (blank screen) while auth state is being rehydrated from the cookie, preventing false redirects on page refresh.

---

## 🔑 Authentication System

Auth state is managed in `AuthContext.jsx` and persisted via a browser cookie.

### State exposed by `useAuth()`:

| Property  | Type             | Description                                                        |
| --------- | ---------------- | ------------------------------------------------------------------ |
| `user`    | `object \| null` | `{ id, email, role }` — `null` if not logged in                    |
| `token`   | `string \| null` | Raw JWT string for attaching to API requests                       |
| `loading` | `boolean`        | `true` while reading the cookie on first mount (prevents flickers) |
| `login`   | `function`       | `login(token)` — saves token to cookie and sets user state         |
| `logout`  | `function`       | Removes cookie and clears all auth state                           |

### Cookie Configuration

- **Name:** `hoop_token`
- **Max age:** 2 hours (matches JWT expiry)
- **SameSite:** `lax`
- **Path:** `/`
- Stored via the `universal-cookie` library

### Rehydration on Refresh

On every page load, `AuthContext` reads the stored cookie, decodes the JWT with `jwt-decode`, checks the `exp` claim against the current time, and restores the session if still valid — without making any network request.

### Making Authenticated API Calls

Always include the token from `useAuth()` in the `Authorization` header:

```js
const { token } = useAuth();

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 👥 Role-Based UI

The UI adapts dynamically based on `user.role`:

| Feature                | USER                 | ADMIN                    |
| ---------------------- | -------------------- | ------------------------ |
| View posts             | APPROVED only        | All statuses             |
| Create post            | ✅ Goes to PENDING   | ✅ Published immediately |
| Edit own post          | ✅ Resets to PENDING | ✅ Keeps current status  |
| Delete own post        | ✅                   | ✅ Can delete any post   |
| Admin Dashboard link   | ❌ Hidden            | ✅ Visible in Navbar     |
| Approve / Reject posts | ❌                   | ✅                       |
| Promote/Demote users   | ❌                   | ✅ (cannot demote self)  |

---

## 🧩 Key Components

### `AuthContext.jsx`

Central auth state. Exposes `useAuth()` hook. Handles cookie persistence, token rehydration, login and logout.

### `Navbar.jsx`

Responsive top nav. Shows different links based on `user.role`. Includes logout button when authenticated.

### `BlogCard.jsx`

Card component for displaying post previews. Shows title, summary, category, author, date, and like count.

### `StatusBadge.jsx`

Color-coded pill badge rendering `PENDING` (yellow), `APPROVED` (green), or `REJECTED` (red).

### `AdminDashboard.jsx`

Two-tab panel:

- **Pending Posts** — Approve, Reject, or Delete each post with optimistic UI updates.
- **Users** — List all registered users, promote/demote between USER and ADMIN roles.

---

## 🏗 Building for Production

```bash
# Create optimised production bundle
npm run build

# Preview the production build locally
npm run preview
```

The output is in the `dist/` directory. Deploy to any static hosting (Vercel, Netlify, Render, etc.).

> **Important:** Set `VITE_API_URL` to your production backend URL in the hosting environment's environment variable settings before building.
