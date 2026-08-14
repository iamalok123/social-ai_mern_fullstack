# 🚀 Social AI — Social Media Scheduler & AI Content Generator (MERN Stack)

A modern, production-ready, full-stack social media management, content ideas Kanban board, AI text composer, AI image generator, and automated post-scheduling platform. Built with **Node.js**, **Express 5**, **React 19**, **TypeScript**, **MongoDB**, **Vite**, **Tailwind CSS v4**, **Google Gemini AI**, **Cloudflare Workers AI**, **Pollinations.ai**, and **Cloudinary**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Google OAuth 2.0 Configuration Guide](#-google-oauth-20-configuration-guide)
- [Installation & Local Setup](#-installation--local-setup)
- [Application Views & Navigation](#-application-views--navigation)
- [Database Models](#-database-models)
- [API Endpoints Reference](#-api-endpoints-reference)
- [AI Capabilities & Fallback Chains](#-ai-capabilities--fallback-chains)
- [Background Scheduler](#-background-scheduler)
- [Deployment (Vercel & Cloud Hosting)](#-deployment-vercel--cloud-hosting)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🌟 Overview

**Social AI** empowers content creators, marketing teams, and businesses to brainstorm, generate, schedule, and automate posts across multiple social channels (Twitter/X, LinkedIn, Facebook, Instagram, etc.).

It features an integrated **Content Ideas Kanban Board** alongside a **dual AI engine**:
1. **AI Text Generation**: Powered by **Google Gemini** (`gemini-2.0-flash` with `gemini-1.5-flash` fallback) for crafting engaging 100–200 word captions, tone-adapted copy, and content-aware visual prompts.
2. **AI Image Generation**: A 2-tier fallback chain using **Cloudflare Workers AI** (`@cf/leonardo/lucid-origin`, configurable via `CLOUDFLARE_IMAGE_MODEL`) and **Pollinations.ai**, automatically uploading generated images to **Cloudinary** for permanent CDN hosting.

An automated background worker (`node-cron`) runs every minute, publishing scheduled posts to connected accounts via the **Zernio API**.

---

## ✨ Key Features

- 🔐 **Authentication & Security**:
  - JWT-based session security and `bcrypt` password hashing.
  - Native Google OAuth 2.0 Sign-In via Google Identity Services (`@accounts/gsi`).
  - Rate limiting via `express-rate-limit` (General: 100 req/15min, Auth: 20 req/15min).
- 💡 **Ideas Kanban Board & AI Brainstorming**:
  - Interactive multi-column Kanban layout (`Backlog`, `In Progress`, `Ready to Post`).
  - Move ideas across columns with ease.
  - **AI Brainstorm Assistant Modal**: Instant topic, hook, outline, and angle brainstorming powered by Google Gemini with multi-model fallback.
  - Create, edit, and delete ideas with cover images and tags.
  - 1-click transition from an Idea into a scheduled post or AI draft.
- 🤖 **AI-Powered Content Composer**: Native integration with `@google/genai` for generating 100–200 word posts with hashtags, hooks, and CTAs across multiple tones (`Professional`, `Creative`, `Funny`, `Minimalist`, `Excited`).
- 🎨 **Multi-Tier AI Image Generator**:
  - **Tier 1 (Primary)**: Cloudflare Workers AI (`@cf/leonardo/lucid-origin` via `CLOUDFLARE_IMAGE_MODEL`).
  - **Tier 2 (Fallback)**: Pollinations.ai with randomized seeds.
  - Images are instantly uploaded and stored in **Cloudinary**.
  - Automatic prompt sanitization to remove conversational prefixes/markdown.
- 📱 **Real-Time Interactive Platform Previews**:
  - Live preview cards for **Twitter/X**, **LinkedIn**, **Facebook**, and **Instagram** directly in the Scheduler.
- 📅 **Post Scheduler**: Schedule text, images, and videos with precise date and time pickers.
- 🔌 **Social Channel Connection**: OAuth connection for Twitter/X, LinkedIn, Facebook, and Instagram powered by the Zernio SDK (`@zernio/node`).
- ⏱️ **Automated Background Dispatcher**: Minute-by-minute automated post dispatcher powered by `node-cron`.
- 📊 **Activity Auditing & Analytics**: Real-time tracking of published posts, connected accounts, and system event history.
- 🎨 **Modern Dark/Light UI**: Built with React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Sonner toast notifications.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons & UI**: `lucide-react`, `@icons-pack/react-simple-icons`
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with Bearer Interceptors & multi-env fallback (`VITE_BACKEND_URL` / `BACKEND_URL`)
- **Notifications**: Sonner

### **Backend**
- **Runtime**: Node.js (v18+) with TypeScript (`tsx` runner)
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose (v9)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcrypt`, Google OAuth
- **Rate Limiting**: `express-rate-limit` (General: 100 req/15min, Auth: 20 req/15min)
- **Cron Jobs**: `node-cron` (Automated 60-second queue processor)
- **Media Upload**: `multer` memory storage + Cloudinary SDK (`cloudinary` v2)
- **AI Text SDK**: `@google/genai` (Google Gemini AI)
- **AI Image Providers**: Cloudflare Workers AI API + Pollinations.ai API
- **Social Media API**: `@zernio/node` SDK

---

## 📁 Project Architecture

```text
social-media_scheduler_fullstack_mern/
├── backend/                        # Express.js REST API (TypeScript)
│   ├── config/                     # Configuration files
│   │   ├── db.ts                   # Mongoose MongoDB connection
│   │   ├── cloudinary.ts           # Cloudinary v2 SDK configuration
│   │   ├── multer.ts               # Storage engine for media upload
│   │   └── zernio.ts               # Zernio API client instance
│   ├── controllers/                # Request handlers & logic
│   │   ├── accountController.ts    # Social account connection & management
│   │   ├── activityController.ts   # System activity & event logging
│   │   ├── authController.ts       # Register, Login, Google OAuth, Change Password
│   │   ├── ideaController.ts       # Ideas CRUD, image upload & AI brainstorm
│   │   ├── postController.ts       # AI post generation, schedule, delete & fetch
│   │   └── socialAuthController.ts # Social media OAuth flow handlers via Zernio
│   ├── middlewares/                # Custom Express middlewares
│   │   └── authMiddleware.ts       # JWT authentication & user extraction
│   ├── models/                     # Mongoose Schema Definitions
│   │   ├── Account.ts              # Connected Social Media Accounts
│   │   ├── ActivityLog.ts          # Activity & Event History Logs
│   │   ├── Generation.ts           # Saved AI-generated prompt content & media
│   │   ├── Idea.ts                 # Ideas Kanban board item schema
│   │   ├── Post.ts                 # Post content, media, schedule & status
│   │   └── User.ts                 # User credentials & profile data
│   ├── routes/                     # Express Router Definitions
│   │   ├── accountRoutes.ts        # /api/accounts
│   │   ├── activityRoutes.ts       # /api/activity
│   │   ├── authRoutes.ts           # /api/auth
│   │   ├── ideaRoutes.ts           # /api/ideas
│   │   ├── postRoutes.ts           # /api/posts
│   │   └── socialAuthRoutes.ts     # /api/oauth
│   ├── services/                   # Core Services
│   │   ├── imageGenService.ts      # Cloudflare Workers AI & Pollinations fallback chain
│   │   └── schedulerService.ts     # Cron-based post queue processor
│   ├── .env.example                # Backend environment template
│   ├── nodemon.json                # Nodemon watcher configuration
│   ├── server.ts                   # Server entrypoint with Express, CORS & Rate Limiting
│   ├── tsconfig.json               # Backend TypeScript config
│   ├── vercel.json                 # Vercel deployment configuration
│   └── package.json                # Dependencies & scripts
│
├── frontend/                       # React 19 Web Application (Vite)
│   ├── public/                     # Static public assets (logo, icons, previews)
│   ├── src/                        # React source code
│   │   ├── api/                    # Axios client instance & endpoint mapping
│   │   ├── assets/                 # Brand assets & platform definitions
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Account/            # Social account connection modals & list
│   │   │   ├── Home/               # Modern landing page components
│   │   │   │   ├── AppShowcase.tsx # Live feature walkthrough showcase
│   │   │   │   ├── FAQ.tsx         # Collapsible FAQ accordion
│   │   │   │   ├── Features.tsx    # Feature highlights & cards
│   │   │   │   ├── Footer.tsx      # Responsive footer with newsletter
│   │   │   │   ├── Hero.tsx        # Hero section with CTA & schedule card
│   │   │   │   ├── HowItWorks.tsx  # Step-by-step workflow guide
│   │   │   │   ├── Navbar.tsx      # Capsule navigation header
│   │   │   │   ├── Pricing.tsx     # Tier comparison cards
│   │   │   │   └── Testimonials.tsx# Infinite marquee social proof
│   │   │   ├── Ideas/              # Kanban board & AI brainstorm modals
│   │   │   │   ├── AiBrainstormModal.tsx # AI ideas generation popup
│   │   │   │   ├── IdeaCard.tsx    # Individual Kanban card item
│   │   │   │   ├── IdeaDialogModal.tsx   # Add/Edit idea modal
│   │   │   │   └── KanbanColumn.tsx# Droppable status column
│   │   │   ├── Media/              # Social media post live preview cards
│   │   │   │   ├── Facebook.tsx    # Facebook feed card preview
│   │   │   │   ├── Instagram.tsx   # Instagram post preview
│   │   │   │   ├── Linkedin.tsx    # LinkedIn feed post preview
│   │   │   │   └── Twitter.tsx     # Twitter/X tweet card preview
│   │   │   ├── Layout.tsx          # Main Dashboard layout shell
│   │   │   ├── Sidebar.tsx         # Navigation sidebar & user popover
│   │   │   └── ThemeToggle.tsx     # Light/Dark mode toggle
│   │   ├── context/                # Global React State Contexts
│   │   │   ├── AuthContext.tsx     # Authentication state provider
│   │   │   └── ThemeContext.tsx    # Application theme context
│   │   ├── pages/                  # Views & pages
│   │   │   ├── Accounts.tsx        # Manage connected social channels
│   │   │   ├── AIComposer.tsx      # Dual AI content workspace & generator
│   │   │   ├── ChangePassword.tsx  # Account security settings
│   │   │   ├── Dashboard.tsx       # Analytics & activity feed
│   │   │   ├── Home.tsx            # Public landing page
│   │   │   ├── Ideas.tsx           # Ideas Kanban Board & AI Brainstorming
│   │   │   ├── Login.tsx           # Auth page (Email + Google OAuth)
│   │   │   └── Scheduler.tsx       # Post composer & calendar queue
│   │   ├── App.tsx                 # Top-level routing & layout wrapper
│   │   ├── main.tsx                # React DOM render entrypoint
│   │   └── index.css               # Tailwind CSS imports & custom animations
│   ├── .env.example                # Frontend environment template
│   ├── vite.config.ts              # Vite plugins & configuration (Port 5173)
│   ├── vercel.json                 # Vercel SPA routing configuration
│   ├── tsconfig.json               # Frontend TypeScript config
│   └── package.json                # Frontend dependencies
│
├── .gitignore                      # Git ignore rules
└── README.md                       # Documentation
```

---

## ⚡ Prerequisites

Ensure your development environment meets the following requirements before setup:

- **Node.js**: `v18.0.0` or higher (recommended `v20.x`)
- **Package Manager**: `npm` (v9+)
- **Database**: Active **MongoDB** instance (MongoDB Atlas cluster or local instance)
- **API Keys**:
  - [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini Text AI)
  - [Cloudflare Dashboard](https://dash.cloudflare.com/) Account ID & API Token (for Flux/Leonardo Image AI)
  - [Cloudinary](https://cloudinary.com/) Account (Cloud Name, API Key, API Secret)
  - [Zernio](https://zernio.com/) API Key (for Social Media Posting)
  - [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 Client ID

---

## 🔑 Environment Variables

### 1. Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
# Server
PORT=3000
FRONTEND_URL="http://localhost:5173"

# MongoDB Atlas Connection
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/social-ai?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Social Media Integration (Zernio API)
ZERNIO_API_KEY=sk_your_zernio_api_key

# Google Gemini AI (Text Generation)
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

# Cloudinary (Media Hosting)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Cloudflare Workers AI (Image Generation)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_IMAGE_MODEL="@cf/leonardo/lucid-origin"
```

### 2. Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
# Backend API URL
VITE_BACKEND_URL="http://localhost:3000"

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 🔐 Google OAuth 2.0 Configuration Guide

If you encounter `Error 400: origin_mismatch` during Google Sign-In, follow these steps to register your origins:

1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your project and click on your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `http://localhost:5173` *(Local Vite frontend)*
   - `http://localhost:3000` *(Local Backend)*
   - `http://localhost`
   - `https://your-production-app.vercel.app` *(Production domain)*
   > **Note:** Do not include trailing slashes `/` in JavaScript origins.
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173`
   - `https://your-production-app.vercel.app`
5. Click **SAVE** and allow 2–5 minutes for changes to propagate.

---

## 🚀 Installation & Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/iamalok123/social-ai_mern_fullstack.git
cd social-media_scheduler_fullstack_mern
```

### Step 2: Install & Start Backend
```bash
cd backend
npm install
npm run dev
```
*Backend server runs at `http://localhost:3000`.*

### Step 3: Install & Start Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend web app runs at `http://localhost:5173`.*

---

## 🗺️ Application Views & Navigation

| Route | View | Description |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Public showcase highlighting hero section, live app showcase, FAQ, pricing, and testimonials. |
| `/login` | **Authentication** | Secure email/password login, account registration, and Google OAuth 2.0. |
| `/dashboard` | **Dashboard** | Analytics metrics, upcoming post queue summary, and activity feed. |
| `/accounts` | **Social Accounts** | Connect and manage Twitter/X, LinkedIn, Facebook, and Instagram channels. |
| `/schedule` | **Post Scheduler** | Interactive calendar & post composer with real-time Twitter, LinkedIn, Facebook, and Instagram live previews. |
| `/ideas` | **Ideas Kanban** | Interactive Kanban board (`Backlog`, `In Progress`, `Ready to Post`) with AI brainstorming popover. |
| `/ai-composer` | **AI Composer** | Full-fledged AI workspace for generating text captions and Cloudflare/Pollinations AI images. |
| `/change-password` | **Account Settings** | Security preferences and password management. |

---

## 🗄️ Database Models

### 1. **User Model** (`User.ts`)
- `email`: String (Required, Unique)
- `password`: String (Hashed with `bcrypt`)
- `name`: String (Required)
- `authProvider`: Enum (`email`, `google`)
- `picture`: String (Avatar URL)
- `zernioProfileId`: String (Zernio Workspace ID)

### 2. **Idea Model** (`Idea.ts`)
- `user`: ObjectId (Ref: `User`, Required)
- `title`: String (Required)
- `description`: String (Markdown/Text)
- `columnId`: String (`backlog`, `in_progress`, `ready`)
- `images`: Array of Strings (Cloudinary image URLs)
- `tags`: Array of Strings (Categorization tags)

### 3. **Account Model** (`Account.ts`)
- `user`: ObjectId (Ref: `User`)
- `platform`: Enum (`twitter`, `linkedin`, `facebook`, `instagram`, etc.)
- `handle`: String
- `zernioAccountId`: String
- `status`: Enum (`connected`, `disconnected`)
- `avatarUrl`: String

### 4. **Post Model** (`Post.ts`)
- `user`: ObjectId (Ref: `User`)
- `content`: String (Post body text)
- `mediaUrl`: String (Cloudinary asset URL)
- `mediaType`: Enum (`image`, `video`)
- `platforms`: Array of Strings
- `scheduledFor`: Date
- `status`: Enum (`draft`, `scheduled`, `published`, `failed`)

### 5. **Generation Model** (`Generation.ts`)
- `user`: ObjectId (Ref: `User`)
- `prompt`: String (Original prompt)
- `content`: String (Generated post content)
- `mediaUrl`: String (Generated AI image URL)
- `mediaType`: Enum (`image`, `video`)
- `tone`: String
- `theme`: String

### 6. **ActivityLog Model** (`ActivityLog.ts`)
- `user`: ObjectId (Ref: `User`)
- `actionType`: Enum (`POST_PUBLISHED`, `AI_REPLY`)
- `description`: String
- `relatedPost`: ObjectId (Ref: `Post`)

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Rate Limit | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new email/password account | 20 / 15 min | ❌ |
| `POST` | `/api/auth/login` | Email/password login | 20 / 15 min | ❌ |
| `POST` | `/api/auth/google` | Google OAuth login / account creation | 20 / 15 min | ❌ |
| `PUT` | `/api/auth/change-password` | Change account password | 20 / 15 min | ✅ |

### 💡 Ideas Kanban (`/api/ideas`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ideas` | Fetch all user ideas | ✅ |
| `POST` | `/api/ideas` | Create a new idea card | ✅ |
| `PUT` | `/api/ideas/:id` | Update idea content, tags, or column status | ✅ |
| `DELETE` | `/api/ideas/:id` | Delete an idea card | ✅ |
| `POST` | `/api/ideas/upload` | Upload idea cover images to Cloudinary | ✅ |
| `POST` | `/api/ideas/generate-ai` | Generate batch idea suggestions via AI | ✅ |
| `POST` | `/api/ideas/ai-assistant` | AI assistant brainstorming for outlines/hooks | ✅ |

### 🔗 Social OAuth (`/api/oauth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/oauth/:platform/url` | Generate OAuth connection URL via Zernio | ✅ |
| `GET` | `/api/oauth/sync` | Sync connected accounts from Zernio → MongoDB | ✅ |

### 👤 Accounts (`/api/accounts`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/accounts` | Fetch all connected social channels | ✅ |
| `POST` | `/api/accounts` | Manually add a social account | ✅ |
| `DELETE` | `/api/accounts/:id` | Disconnect and remove account | ✅ |

### 📝 Posts & AI Composer (`/api/posts`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Fetch all scheduled and published posts | ✅ |
| `GET` | `/api/posts/generations` | Fetch history of AI generations | ✅ |
| `DELETE` | `/api/posts/generations/:id` | Delete an AI generation from history | ✅ |
| `POST` | `/api/posts/generate` | Generate post text (Gemini) & AI image (Cloudflare/Pollinations) | ✅ |
| `POST` | `/api/posts` | Schedule a new post (supports multipart media upload) | ✅ |

### 📊 Activity (`/api/activity`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/activity` | Retrieve recent activity logs | ✅ |

### 🩺 System (`/health`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server uptime and health status check | ❌ |

---

## 🤖 AI Capabilities & Fallback Chains

### 1. **Text Generation Engine**
- **Model**: `gemini-2.0-flash` (via `@google/genai`)
- **Output Constraints**: Generates comprehensive 100–200 word social posts with hooks, takeaways, CTAs, and 3-5 trending hashtags.
- **Fallback Flow**: `gemini-2.0-flash` → `gemini-1.5-flash` → Dynamic Topic Template Engine.

### 2. **Image Generation Engine**
- **Primary Tier**: Cloudflare Workers AI (`@cf/leonardo/lucid-origin`, dynamically configured via `CLOUDFLARE_IMAGE_MODEL`). Generates fast, high-quality images from content-aware prompts, uploaded to Cloudinary.
- **Fallback Tier**: Pollinations.ai with randomized seeds, uploaded to Cloudinary (or direct URL fallback).
- **Prompt Sanitization**: Automatic cleanup of AI-generated image prompts to remove markdown asterisks, conversational framing, and quotes.

---

## ⏱️ Background Scheduler

The background worker (`backend/services/schedulerService.ts`) runs every minute via `node-cron`:

```typescript
cron.schedule("* * * * *", async () => { ... });
```

1. Queries MongoDB for posts with `status: "scheduled"` and `scheduledFor <= current_time`.
2. Finds connected Zernio accounts for the targeted platforms.
3. Dispatches payload (content, media, platform IDs) to Zernio API.
4. Updates post status to `"published"` (or `"failed"`) and logs to `ActivityLog`.

---

## 🌐 Deployment (Vercel & Cloud Hosting)

### **Frontend (Vercel)**
1. Import repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Environment Variables:
   - `VITE_BACKEND_URL`: Your deployed backend URL
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

### **Backend (Render / Railway / Vercel)**
- **Render / Railway (Recommended)**: Set build command `npm install && npm run build` and start command `npm start`. Persistent server keeps `node-cron` running 24/7.
- **Vercel Serverless**: Configured with `backend/vercel.json`. For scheduled posts, trigger `/api/posts` via Vercel Cron Jobs or an external cron service (e.g. Cron-Job.org).

---

## 📜 Available Scripts

### **Backend (`/backend`)**
- `npm run dev`: Hot-reload development server via `nodemon` + `tsx`.
- `npm start`: Production server runner via `tsx server.ts`.
- `npm run build`: Compile TypeScript via `tsc`.

### **Frontend (`/frontend`)**
- `npm run dev`: Start Vite development server on port 5173.
- `npm run build`: TypeScript check & production build bundle via Vite.
- `npm run preview`: Preview built production app.
- `npm run lint`: Run ESLint checks.

---

## 📄 License

This project is open-source and licensed under the **MIT License**.
