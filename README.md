<div align="center">
  <img src="frontend/public/logo.svg" alt="BlogHub Logo" width="180" />
</div>

# BlogHub

BlogHub is a modern, full-stack blogging platform built with a robust NestJS backend and a sleek Next.js frontend. It allows users to create, manage, and explore articles with a highly responsive and user-friendly interface. Featuring secure authentication, role-based access (including admin dashboard), image uploads, and a beautiful UI, BlogHub is ideal for both end-users and developers.

---

## Table of Contents
- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Quickstart](#quickstart)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Role Management & Admin](#role-management--admin)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Support](#support)

---

## Features
- User registration, login, and secure session management (JWT, cookies)
- User profile update (name, email, password, avatar, etc.)
- Article image upload (Cloudinary, secure_url, JWT protected)
- Smooth navigation with a global user context
- Create, edit, delete, and view articles
- Favorites system (bookmarked articles)
- Personal dashboard (my posts, bookmarks, etc.)
- Article search
- Notifications (structure ready)
- Modern, responsive, and animated UI
- Robust fallback for missing images
- Admin dashboard for user & category management

---

## Architecture & Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) (TypeScript) with [Prisma ORM](https://www.prisma.io/) for database access
- **Frontend:** [Next.js](https://nextjs.org/) (TypeScript, React)
- **Database:** MongoDB (via Prisma)
- **Image Hosting:** Cloudinary
- **Authentication:** JWT (with cookies)
- **UI:** TailwindCSS, Framer Motion, Lucide Icons

---

## Quickstart

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/Brandon22030/BlogHub.git
cd BlogHub
```

### 2. Backend Setup (NestJS)
```bash
cd backend
cp .env.example .env # Edit .env with your DB and Cloudinary credentials
npm install
npx prisma migrate dev # Initialize DB
npm run start:dev
```

### 3. Frontend Setup (Next.js)
```bash
cd ../frontend
cp .env.example .env # Edit .env with correct API_URL
npm install
npm run dev
```

Frontend will be available at [http://localhost:3000](http://localhost:3000), backend at [http://localhost:3001](http://localhost:3001) by default.

---

## Project Structure
```
BlogHub/
  backend/    # NestJS API, Prisma, Auth, Roles, etc.
  frontend/   # Next.js app, UI, UserContext, etc.
  README.md   # This file
```

---

## Environment Variables

Both backend and frontend require environment variables. See `.env.example` in each folder for all options.

- **Backend:**
  - `DATABASE_URL` (MongoDB connection string)
  - `JWT_SECRET`
  - `CLOUDINARY_URL` (for image uploads)
- **Frontend:**
  - `NEXT_PUBLIC_API_URL` (should point to backend API)

---

## Role Management & Admin

- Users have roles: `USER`, `ADMIN`.
- Only admins can access the admin dashboard and manage categories/users.
- Role-based access is enforced both in the backend (NestJS guards) and frontend (UI hides admin features for non-admins).

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

Please follow the code style and add tests where relevant.

---

## FAQ

**Q: I can't see the Administration button?**
A: Make sure your user role is `ADMIN` (case-insensitive). Log out and log back in if you just changed roles.

**Q: Image upload fails?**
A: Check your Cloudinary credentials and backend `.env` config.

**Q: How do I reset my password?**
A: Use the profile edit page after login.

---

## Support

For issues, open a GitHub issue or contact the maintainer via the repository.

---

---

## Architecture & Stack

- **Frontend**: Next.js 13+ (App Router, TypeScript, React Context API, TailwindCSS, js-cookie, jwt-decode)
- **Backend**: NestJS, Prisma ORM, MongoDB, JWT, Multer (image upload), Cloudinary (article images), bcrypt
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
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (for image uploads)
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
- **Article Images:** Uploaded via a JWT-protected endpoint (`/articles/images/upload`). Images are stored on [Cloudinary](https://cloudinary.com/) and the backend returns a `secure_url`.
- **Profile Images:** Uploaded via Multer to the `backend/uploads` folder.
- **Frontend Fallback Logic:**
  - If an image URL is missing or invalid, a default SVG is shown (for both articles and avatars).
  - The frontend always checks if the URL starts with `http` (Cloudinary) or falls back to the local image or default.
- **Loader:**
  - While uploading an article image, a centered spinner and message are displayed in the SendPost form.
- **Access:**
  - Article images: Cloudinary URLs (https)
  - Profile images: `/uploads/...` via backend

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
CLOUDINARY_CLOUD_NAME=... # Cloudinary cloud name
CLOUDINARY_API_KEY=...    # Cloudinary API key
CLOUDINARY_API_SECRET=... # Cloudinary API secret
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
