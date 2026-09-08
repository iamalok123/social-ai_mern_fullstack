# 🚀 SocialAI Studio — MERN Multi-Platform Scheduler

[![Tests](https://img.shields.io/badge/Tests-130%20Passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-ready, full-stack social media management platform designed to generate, preview, and schedule AI-powered content across **Twitter / X, LinkedIn, Instagram, and Facebook**.

---

## ✨ Key Features

- **🤖 Dual-AI Generation**: Text and captions via Google Gemini 2.0 Flash; 2-tier visual generation (Cloudflare Workers AI SDXL Lightning with Pollinations fallback).
- **💡 Content Ideas Hub**: Kanban board (Ideas, Drafts, Scheduled, Published) with one-click conversion to posts.
- **📱 True-to-Life Previews**: Real-time mockups for Twitter, LinkedIn, Instagram, and Facebook feeds.
- **⏰ Resilient Scheduler**: Node-cron background evaluation (every 30s) + external webhook trigger (`/api/posts/cron-trigger`) for serverless/Render spin-up keep-alive.
- **🛡️ Secure Multi-Tenant Auth**: JWT-based session security with bcrypt password hashing and token refresh.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Date-fns |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose, Node-Cron, Multer, JWT, Bcrypt |
| **AI & Storage** | Google Gemini 2.0 (`@google/genai`), Cloudflare Workers AI, Cloudinary |
| **Testing** | Vitest, React Testing Library, Supertest (130 comprehensive tests) |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ & npm
- MongoDB instance (local or Atlas URI)
- Cloudinary, Gemini API & Cloudflare credentials

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Configure your environment variables
npm run dev            # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env   # Set VITE_API_URL=http://localhost:5000/api
npm run dev            # Runs on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/social_scheduler
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDFLARE_ACCOUNT_ID=your_cf_account_id
CLOUDFLARE_API_TOKEN=your_cf_api_token
CRON_SECRET=your_optional_webhook_secret
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register`, `/login` | User registration & authentication |
| `GET / POST` | `/api/posts` | Fetch paginated posts & create scheduled post |
| `PUT / DELETE` | `/api/posts/:id` | Update or cancel scheduled post |
| `GET / POST` | `/api/posts/cron-trigger` | External webhook for cron trigger & keep-alive |
| `POST` | `/api/ai/generate`, `/generate-image` | Gemini text & Cloudflare image generation |
| `GET / POST` | `/api/ideas` | Kanban content ideas management |

---

## 🧪 Testing

```bash
# Run backend test suite (95 tests)
cd backend && npm test

# Run frontend test suite (35 tests)
cd frontend && npm test
```

---

## 🌐 Deployment & Architecture

- **Frontend**: Deployable to [Vercel](https://vercel.com) / [Netlify](https://netlify.com). Set `VITE_API_URL`.
- **Backend**: Deployable to [Render](https://render.com) / [Railway](https://railway.app). Set all `.env` secrets.
- **Render Free-Tier Keep-Alive**: Point a free ping service (e.g. [cron-job.org](https://cron-job.org)) every 10 minutes to `/api/posts/cron-trigger` with header `x-cron-secret: <CRON_SECRET>` to prevent cold starts and ensure on-time scheduling.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
