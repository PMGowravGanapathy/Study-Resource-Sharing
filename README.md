# Study Resource Sharing Platform

A full-stack web application built for students and educators to share, discover, and download study materials like PDFs, notes, and external links. Features a modern dark-themed UI built with React and Tailwind CSS, and a robust Node.js/Express backend connected to MongoDB.

## Features

- **User Authentication:** Secure JWT-based signup and login system with bcrypt password hashing.
- **Resource Management:** Upload PDFs, notes, or links. Files are stored locally and served via the backend.
- **Discover & Search:** Search resources by title or description, and filter by subject.
- **Like/Bookmark:** Users can like resources to boost their visibility.
- **Admin Dashboard:** Role-based access control allowing admins to view platform statistics and moderate (delete) resources and users.
- **Modern UI:** Responsive, dark-themed interface with smooth interactions and toast notifications.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Zustand (state management), React Router DOM, Axios, Lucide React (icons), React Hot Toast.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, Multer (file uploads).

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas URI)

### Local Development Setup

1. **Clone the repository** (if applicable) and navigate to the project directory.

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Make sure your MongoDB instance is running locally on `mongodb://127.0.0.1:27017` or update the `MONGODB_URI` in `backend/.env`.
   - Start the backend server:
   ```bash
   node server.js
   ```
   - The backend runs on `http://localhost:5000`.

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   - Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

### Environment Variables

**Backend (`backend/.env`):**
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/study-resources`
- `JWT_SECRET=your_jwt_secret_here`
- `NODE_ENV=development`

## Deployment

### Backend (Render / Heroku)
1. Add environment variables to your hosting provider.
2. Set the build command to `npm install` and start command to `node server.js`.
3. If deploying, you will need a persistent storage solution (like Cloudinary or AWS S3) instead of local Multer storage, or use a disk-backed service.

### Frontend (Vercel / Netlify)
1. Set the build command to `npm run build`.
2. Set the output directory to `dist`.
3. Make sure to update the `baseURL` in `src/services/api.js` to point to your deployed backend URL before building.
