# 🚀 Social AI — Social Media Scheduler & AI Content Generator

A modern full-stack MERN platform to brainstorm content ideas, generate AI copy and images, schedule posts, and automate publishing across social platforms (Twitter/X, LinkedIn, Facebook, Instagram).

---

## ✨ Features

- **💡 Content Ideas Kanban**: Organize ideas across columns (`Backlog`, `In Progress`, `Ready to Post`) with AI-assisted brainstorming.
- **🤖 AI Content Composer**: Generate engaging post text, hooks, CTAs, and hashtags powered by **Google Gemini**.
- **🎨 AI Image Generation**: Multi-tier generation (**Cloudflare Workers AI** + **Pollinations.ai**) hosted directly on **Cloudinary**.
- **📱 Live Platform Previews**: Real-time card previews for Twitter/X, LinkedIn, Facebook, and Instagram.
- **📅 Post Scheduler**: Schedule posts with precise date/time pickers and automatic background dispatching via `node-cron` and **Zernio API**.
- **🔐 Secure Authentication**: JWT-based email/password authentication and Google OAuth 2.0.
- **🌓 Modern UI**: Sleek, responsive interface built with React 19, Tailwind CSS v4, Lucide icons, and dark/light mode.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Axios, Lucide Icons, Sonner
- **Backend**: Node.js, Express 5, TypeScript, MongoDB (Mongoose 9), `node-cron`, Multer, Cloudinary SDK
- **AI & Social APIs**: Google Gemini AI (`@google/genai`), Cloudflare Workers AI, Pollinations.ai, Zernio SDK (`@zernio/node`)

---

## 📁 Project Structure

```text
social-media_scheduler_fullstack_mern/
├── backend/               # Express.js REST API & Scheduler
│   ├── config/            # Database, Cloudinary & Zernio configurations
│   ├── controllers/       # Auth, Posts, Ideas, Accounts, and Activity logic
│   ├── models/            # Mongoose schemas (User, Post, Idea, Account, etc.)
│   ├── routes/            # Express endpoint routers
│   ├── services/          # Post queue cron runner & AI image generation
│   └── server.ts          # Express server entry point
│
└── frontend/              # React 19 + Vite Application
    ├── src/
    │   ├── components/    # Reusable UI, Kanban board, and platform previews
    │   ├── context/       # Auth and Theme context providers
    │   ├── pages/         # Dashboard, Scheduler, Ideas, AI Composer, etc.
    │   └── App.tsx        # App routing and shell layout
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+) & npm
- MongoDB database (local or Atlas)
- Required API keys: Google Gemini, Cloudinary, Zernio, Cloudflare (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/iamalok123/social-ai_mern_fullstack.git
cd social-media_scheduler_fullstack_mern
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # Configure your credentials
npm run dev              # Runs on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env     # Configure frontend environment variables
npm run dev              # Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=3000
FRONTEND_URL="http://localhost:5173"
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/social-ai
JWT_SECRET=your_jwt_secret

# AI & Media
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Social & Auth
ZERNIO_API_KEY=your_zernio_key
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudflare Workers AI (Optional)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_IMAGE_MODEL="@cf/leonardo/lucid-origin"
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📜 Available Scripts

| Location | Command | Description |
| :--- | :--- | :--- |
| **Backend** | `npm run dev` | Start development server with auto-reload |
| **Backend** | `npm start` | Run production server |
| **Backend** | `npm run build` | Compile TypeScript to JavaScript |
| **Frontend** | `npm run dev` | Start Vite dev server |
| **Frontend** | `npm run build` | Build production bundle |
| **Frontend** | `npm run preview`| Preview production build locally |

---

## 🌐 Deployment Notes

- **Frontend**: Deploy `frontend/` on **Vercel** with Vite preset. Set `VITE_BACKEND_URL` and `VITE_GOOGLE_CLIENT_ID`.
- **Backend**: Deploy `backend/` on **Render** or **Railway** (Root Directory: `backend`, Build Command: `npm install && npm run build`, Start Command: `npm start`). Auto-build via `postinstall` is configured.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
