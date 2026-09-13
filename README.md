# 🚀 SocialAI Studio — Multi-Platform AI Social Scheduler

[![Tests](https://img.shields.io/badge/Tests-146%20Passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack MERN application for generating, scheduling, previewing, and auto-publishing social media content across **Twitter / X, LinkedIn, Instagram, Facebook, and YouTube**.

---

## ✨ Features

- **🤖 Dual-Engine AI Studio**: Text & caption generation via **Google Gemini 2.0 Flash**; visual generation via **Cloudflare Workers AI** (with Pollinations fallback).
- **📱 True-to-Life Previews**: Pixel-accurate live preview mockups for Twitter, LinkedIn, Instagram, Facebook, and YouTube feeds.
- **🛡️ Native Platform Rule Matrix**: Automated validation for platform-specific constraints (character limits, media ratios, carousel limits, COPPA tags, and video requirements).
- **⏰ Resilient Scheduler**: Background evaluation engine (`node-cron`) + external webhook trigger (`/api/posts/cron-trigger`) for serverless/Render keep-alive.
- **💡 Content Ideas Hub**: Kanban board (Ideas, Drafts, Scheduled, Published) with AI brainstorming and 1-click scheduling conversion.
- **🔗 Social Account Hub**: Multi-account OAuth connection, token health checks, and automatic disconnect handling powered by Zernio.
- **🔐 Enterprise Security**: JWT auth, bcrypt password hashing, Google OAuth, and IP rate limiting.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Simple Icons, Sonner |
| **Backend** | Node.js, Express 5, TypeScript, MongoDB, Mongoose, Node-Cron, Multer, Bcrypt, JWT |
| **Integrations** | Zernio SDK (Social Publishing), Google Gemini 2.0, Cloudflare Workers AI, Cloudinary |
| **Testing** | Native Node Test Runner (`node --test`, `tsx --test`) — 146 automated tests |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # DB, Cloudinary, Multer configurations
│   ├── controllers/     # Auth, post, idea, account & platform controllers
│   ├── middlewares/     # JWT auth, validation & rate limiting
│   ├── models/          # User, Post, Account, Idea & ActivityLog schemas
│   ├── routes/          # REST route handlers
│   ├── services/        # Scheduler engine, ImageGen & Social platform adapters
│   └── tests/           # 111 unit & integration tests
└── frontend/
    ├── src/
    │   ├── api/         # Axios client and API wrappers
    │   ├── components/  # UI components, scheduler controls & live previews
    │   ├── pages/       # Dashboard, Scheduler, AIComposer, Ideas, Accounts, Login
    │   └── utils/       # Platform validation matrices & character counters
    └── tests/           # 35 modular scheduler unit tests
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+ & npm
- MongoDB Atlas or local MongoDB instance
- API keys: Google Gemini, Cloudflare, Cloudinary, Zernio

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # Configure your environment variables
npm run dev              # Starts API server on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env     # Configure VITE_BACKEND_URL
npm run dev              # Starts Vite dev server on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | API server port (default: `3000`) |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `MONGODB_URL` | MongoDB connection connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ZERNIO_API_KEY` | Zernio API key for social publishing |
| `GEMINI_API_KEY` | Google Gemini API key for AI text generation |
| `GEMINI_MODEL` | Gemini model ID (e.g. `gemini-2.0-flash`) |
| `CLOUDINARY_*` | Cloud name, API key, and secret for media assets |
| `CLOUDFLARE_*` | Account ID, API token, and model for image generation |
| `GOOGLE_CLIENT_ID`| Client ID for Google OAuth authentication |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend API base URL (e.g. `http://localhost:3000`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID for sign-in |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register`, `/login`, `/google` | User authentication & Google sign-in |
| `GET / POST` | `/api/posts` | List user posts / Schedule new post with media |
| `DELETE` | `/api/posts/:id` | Cancel/delete scheduled post |
| `GET` | `/api/posts/cron-trigger` | Webhook to evaluate scheduled posts & ping server |
| `POST` | `/api/posts/generate` | AI generation for copy, hooks & hashtags |
| `GET / POST` | `/api/ideas` | Kanban content ideas management |
| `GET / DELETE`| `/api/accounts` | Manage connected social platform accounts |
| `GET` | `/api/oauth/:platform/url` | Generate social OAuth connection URL |
| `POST` | `/api/platforms/:platform/validate` | Server-side platform constraint validation |

---

## 🧪 Testing

```bash
# Run backend test suite (111 tests)
cd backend && npm test

# Run frontend test suite (35 tests)
cd frontend && npm test
```

---

## 🌐 Production & Keep-Alive

- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with `VITE_BACKEND_URL`.
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app).
- **Prevent Cold Starts**: Set up a free 5-10 min recurring ping (e.g. [cron-job.org](https://cron-job.org)) targeting `https://<backend-host>/api/posts/cron-trigger` to ensure on-time publishing on free-tier hosting.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
