<div align="center">
  <img src="frontend/public/logo.svg" alt="BlogHub Logo" width="180" />
</div>

# BlogHub

BlogHub is a modern blogging platform allowing users to create, manage, customize, and explore articles with a smooth and reactive user experience.

---

## Table of Contents
- [Features](#features)
- [Architecture & Stack](#architecture--stack)
- [Installation & Getting Started](#installation--getting-started)
- [Project Structure](#project-structure)
- [Gestion des Utilisateurs](#gestion-des-utilisateurs)
- [Sécurité & Authentification](#sécurité--authentification)
- [Mise à jour du profil utilisateur](#mise-à-jour-du-profil-utilisateur)
- [Gestion des images](#gestion-des-images)
- [Personnalisation & UI](#personnalisation--ui)
- [Variables d'environnement](#variables-denvironnement)
- [FAQ & Dépannage](#faq--dépannage)

---

## Features
- **User registration, login, and secure session management (JWT, cookies)**
- **User profile update (name, email, password, avatar, etc.)**
- **Profile image upload**
- **Smooth navigation with a global user context (UserContext)**
- **Instant user info updates across the app (navbar, menus, profile, etc.)**
- **Create, edit, delete, and view articles**
- **Favorites system (bookmarked articles)**
- **Personal dashboard (my posts, bookmarked articles, etc.)**
- **Article search**
- **Notifications (structure ready)**
- **Modern, responsive, and animated UI**

---

## Architecture & Stack

- **Frontend**: Next.js 13+ (App Router, TypeScript, React Context API, TailwindCSS, js-cookie, jwt-decode)
- **Backend**: NestJS, Prisma ORM, MongoDB, JWT, Multer (image upload), bcrypt
- **Other**: Email sending (nodemailer), environment variable management (.env)

---

## Installation & Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd BlogHub
```

### 2. Backend Setup
- Go to the `backend` folder
- Install dependencies:
```bash
npm install
```
- Copy `.env.example` to `.env` and fill in:
  - `DATABASE_URL` (MongoDB)
  - `JWT_SECRET` (JWT secret key)
  - `EMAIL_USER` and `EMAIL_PASS` (for email sending)
- Start the server:
```bash
npm run start:dev
```

### 3. Frontend Setup
- Go to the `frontend` folder
- Install dependencies:
```bash
npm install
```
- Start the server:
```bash
npm run dev
```

### 4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## Project Structure

```
BlogHub/
├── backend/
│   ├── src/
│   │   ├── user/            # User management (service, controller, module)
│   │   ├── auth/            # JWT authentication
│   │   ├── prisma/          # Prisma service
│   │   └── ...
│   ├── uploads/             # Uploaded images
│   └── .env                 # Backend environment variables
├── frontend/
│   ├── app/                 # Next.js pages (profile, edit, dashboard, etc.)
│   ├── components/          # UI components (navbar, search&avatar, dashboard, etc.)
│   ├── context/             # UserContext for global user management
│   ├── public/              # Static images (logo, avatars, etc.)
│   └── ...
└── README.md
```

---

## User Management
- **Registration and login** with password verification (bcrypt) and JWT token generation.
- **Global user context**: all user info is accessible everywhere via React context (`UserContext`).
- **Profile update**: change name, email, password, profile image (upload), with current password verification.
- **Instant update**: after modification, the user context is refreshed and all info is up to date in the UI.

---

## Security & Authentication
- **JWT**: every protected request requires a valid JWT token (stored in cookie).
- **Password verification** before any sensitive modification.
- **Protected endpoints** on the backend using NestJS guards.
- **Password hashing** with bcrypt.

---

## User Profile Update
- **API**: `PUT /user/profile` (JWT protected)
- **Payload**: `{ userName, email, password, oldPassword, image }`
- **Response**: `{ message, token, user }`
- **Frontend**: after update, the token cookie is replaced and the user context is refreshed (no reload needed)
- **Image**: uploaded to `/uploads` on the backend, accessible via `http://localhost:3001/uploads/...`

---

## Image Management
- **Upload**: via Multer (NestJS)
- **Storage**: `backend/uploads` folder
- **Access**: the image URL is automatically prefixed on the frontend for display (see UserContext and SearchAvatar)

---

## Customization & UI
- **Navbar** and **menus** always display up-to-date user info (name, avatar)
- **Dashboard**: quick access to my posts, bookmarked articles, profile editing
- **Reusable components**: SearchAvatar, Marked, MyPosts, Footer, etc.
- **Design**: TailwindCSS, Framer Motion animations, responsive mobile/desktop

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=... # MongoDB URL
JWT_SECRET=...   # JWT secret key
EMAIL_USER=...   # Email for sending mails
EMAIL_PASS=...   # Email app password
```

### Frontend
- No critical variable, everything goes through the secured backend

---

## FAQ & Troubleshooting

### I can't see my profile image after upload
- Check that the image URL starts with `/uploads/` and that the backend is accessible at `localhost:3001`.
- If you deploy, adapt the base URL in the frontend.

### Profile modifications are not applied
- Make sure you provide the old password when updating.
- Make sure the JWT token is updated on the frontend (cookie) and that the user context is refreshed.

### Error "secretOrPrivateKey must have a value"
- Check that `JWT_SECRET` is present in the backend `.env` and that the `JwtModule` uses it.

### CORS issues
- Make sure the backend allows requests from the frontend (see NestJS CORS config).

---

## Contributing

1. Fork the repo
2. Create a branch (`feature/my-feature`)
3. Make a detailed PR

---

## Authors
- Brandon Medehou (and contributors)

---

## License
[MIT](LICENSE)
