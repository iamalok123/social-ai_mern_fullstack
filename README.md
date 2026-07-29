# 🚀 Social Media Scheduler & AI Content Generator (MERN Stack)

A modern, full-stack social media management, content generation, and post-scheduling platform. Built with **Node.js**, **Express 5**, **React 19**, **TypeScript**, **MongoDB**, **Vite**, **Tailwind CSS v4**, **Google Gemini AI**, and **Cloudinary**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Local Setup](#-installation--local-setup)
- [Database Models](#-database-models)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Background Scheduler](#-background-scheduler)
- [AI Content Generation](#-ai-content-generation)
- [Available Scripts](#-available-scripts)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [License](#-license)

---

## 🌟 Overview

The **Social Media Scheduler** allows individuals, creators, and marketing teams to write, generate, schedule, and publish posts across multiple social channels simultaneously. Integrated with **Google Gemini AI**, users can instantly craft high-converting captions, tone-adapted copy, and trending hashtags, while an automated background worker (`node-cron`) handles post publishing according to user-defined schedules.

---

## ✨ Key Features

- 🔐 **Authentication & Authorization**: JWT-based session security, password hashing with `bcrypt`, and Google OAuth support.
- 🤖 **AI-Powered Content Composer**: Native integration with `@google/genai` (Google Gemini) for automated caption generation, content polishing, and hashtag recommendations.
- 📅 **Visual Post Scheduler**: Intuitive calendar and list-based scheduler for managing upcoming and historical posts.
- 🖼️ **Media Upload & Management**: Integrated with **Cloudinary** and `multer` for image/video upload processing.
- 🔌 **Social Account Integration**: Connect social media channels (Twitter/X, LinkedIn, Facebook, Instagram, etc.) powered by Zernio SDK (`@zernio/node`).
- ⏱️ **Automated Background Job Processing**: Minute-by-minute automated post dispatcher using `node-cron`.
- 📊 **Activity Auditing & Logs**: Comprehensive tracking of account actions, post states (`DRAFT`, `SCHEDULED`, `PUBLISHED`, `FAILED`), and error details.
- 🎨 **Modern Dark/Light UI**: Built with React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Sonner notifications.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons & UI**: `lucide-react`, `@icons-pack/react-simple-icons`
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with Bearer Interceptors
- **Notifications**: Sonner

### **Backend**
- **Runtime**: Node.js (v18+) with TypeScript (`tsx` runner)
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose (v9)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **Cron Jobs**: `node-cron` (Automated 60-second polling job)
- **File Upload**: `multer` + Cloudinary API (`cloudinary`)
- **AI SDK**: `@google/genai` (Google Gemini AI API)
- **Social Media Integration**: `@zernio/node` SDK

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
│   │   ├── accountController.ts    # Connected social accounts management
│   │   ├── activityController.ts   # System activity & audit logging
│   │   ├── authController.ts       # Authentication (Register, Login, Password)
│   │   ├── postController.ts       # Post CRUD, publish, and AI generation
│   │   └── socialAuthController.ts # Social media OAuth flow handlers
│   ├── middlewares/                # Custom Express middlewares
│   │   └── authMiddleware.ts       # JWT authentication validator
│   ├── models/                     # Mongoose Schema Definitions
│   │   ├── Account.ts              # Connected Social Media Accounts
│   │   ├── ActivityLog.ts          # Activity & Event History Logs
│   │   ├── Generation.ts           # Saved AI-generated prompt content
│   │   ├── Post.ts                 # Post details, media, schedule & status
│   │   └── User.ts                 # User authentication details
│   ├── routes/                     # Express Router Endpoint Definitions
│   │   ├── accountRoutes.ts        # /api/accounts
│   │   ├── activityRoutes.ts       # /api/activity
│   │   ├── authRoutes.ts           # /api/auth
│   │   ├── postRoutes.ts           # /api/posts
│   │   └── socialAuthRoutes.ts     # /api/oauth
│   ├── services/                   # Background Services
│   │   └── schedulerService.ts     # Cron-based post queue processor
│   ├── server.ts                   # Main server entrypoint
│   ├── tsconfig.json               # Backend TypeScript config
│   └── package.json                # Dependencies & Node scripts
│
├── frontend/                       # React 19 Web Application (Vite)
│   ├── public/                     # Static public assets
│   ├── src/                        # React source code
│   │   ├── api/                    # Axios client instance & configuration
│   │   ├── assets/                 # SVGs, images, and brand assets
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Account/            # Social account connection modals
│   │   │   ├── Layout.tsx          # Main Dashboard shell layout
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── ThemeToggle.tsx     # Light/Dark mode switcher
│   │   ├── context/                # Global React State Contexts
│   │   │   ├── AuthContext.tsx     # User authentication state provider
│   │   │   └── ThemeContext.tsx    # Application theme context
│   │   ├── pages/                  # Route views & pages
│   │   │   ├── Accounts.tsx        # Manage connected social profiles
│   │   │   ├── AIComposer.tsx      # Gemini AI content workspace
│   │   │   ├── ChangePassword.tsx  # User security & password settings
│   │   │   ├── Dashboard.tsx       # Overview & analytics dashboard
│   │   │   ├── Home.tsx            # Public landing page
│   │   │   ├── Login.tsx           # Authentication login page
│   │   │   └── Scheduler.tsx       # Interactive post scheduling calendar
│   │   ├── App.tsx                 # Top-level routing & layout wrapper
│   │   ├── main.tsx                # React DOM render entrypoint
│   │   └── index.css               # Global CSS & Tailwind CSS imports
│   ├── vite.config.ts              # Vite environment & plugin config
│   ├── tsconfig.json               # Frontend TypeScript config
│   └── package.json                # Frontend dependencies
│
├── .gitignore                      # Git ignored files & directories
└── README.md                       # Project documentation
```

---

## ⚡ Prerequisites

Ensure your development environment meets the following requirements before setup:

- **Node.js**: `v18.0.0` or higher (recommended `v20.x`)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`
- **Database**: Active **MongoDB** instance (MongoDB Atlas cluster or local MongoDB)
- **API Accounts**:
  - [Google AI Studio](https://aistudio.google.com/) API Key for Gemini Content Generation
  - [Cloudinary](https://cloudinary.com/) Account for media cloud hosting
  - [Zernio](https://zernio.com/) API Key for multi-channel social posting

---

## 🔑 Environment Variables

### 1. Backend (`backend/.env`)

Create a `.env` file inside the `backend/` root directory:

```env
# Express Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database Connection
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/social-scheduler?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Social Media Integration (Zernio API)
ZERNIO_API_KEY=sk_your_zernio_api_key

# Google Gemini AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth Client ID (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 2. Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Installation & Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/iamalok123/social-ai_mern_fullstack.git
cd social-media_scheduler_fullstack_mern
```

### Step 2: Install & Start Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with live reload (tsx + nodemon)
npm run dev
```
*The Express backend will run at `http://localhost:3000`.*

### Step 3: Install & Start Frontend
Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*The React frontend will be available at `http://localhost:5173`.*

---

## 🗄️ Database Models

### 1. **User Model** (`User.ts`)
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed with `bcrypt`)
- `createdAt` / `updatedAt`: Timestamps

### 2. **Account Model** (`Account.ts`)
- `userId`: ObjectId (Ref: `User`)
- `platform`: String (`twitter`, `linkedin`, `facebook`, `instagram`, `youtube`, etc.)
- `accountName`: String
- `platformAccountId`: String (Zernio / Provider Account ID)
- `avatar`: String (Profile Picture URL)
- `accessToken` / `refreshToken`: Credentials

### 3. **Post Model** (`Post.ts`)
- `userId`: ObjectId (Ref: `User`)
- `content`: String (Post body text)
- `mediaUrls`: Array of Strings (Cloudinary hosted assets)
- `targetAccounts`: Array of ObjectIds (Ref: `Account`)
- `scheduledFor`: Date (Target publish timestamp)
- `status`: Enum (`DRAFT`, `SCHEDULED`, `PUBLISHED`, `FAILED`)
- `errorReason`: String (Error log if publish fails)

### 4. **ActivityLog Model** (`ActivityLog.ts`)
- `userId`: ObjectId (Ref: `User`)
- `action`: String (e.g., `POST_CREATED`, `POST_PUBLISHED`, `ACCOUNT_CONNECTED`)
- `details`: Object / String
- `timestamp`: Date

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ Yes |
| `POST` | `/api/auth/change-password` | Update current account password | ✅ Yes |

### 🔗 Social OAuth (`/api/oauth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/oauth/connect/:platform` | Initiate OAuth flow for social platform | ✅ Yes |
| `GET` | `/api/oauth/callback` | OAuth redirect callback handler | ✅ Yes |

### 👤 Accounts (`/api/accounts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/accounts` | Get list of connected social accounts | ✅ Yes |
| `DELETE` | `/api/accounts/:id` | Disconnect social media profile | ✅ Yes |

### 📝 Posts & AI (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | List posts (filters: status, platform) | ✅ Yes |
| `POST` | `/api/posts` | Create new post (Draft or Scheduled) | ✅ Yes |
| `POST` | `/api/posts/publish-now` | Immediately publish post to networks | ✅ Yes |
| `POST` | `/api/posts/generate-ai` | Generate captions/hashtags using Gemini AI | ✅ Yes |
| `POST` | `/api/posts/upload-media` | Upload image/video to Cloudinary | ✅ Yes |
| `DELETE` | `/api/posts/:id` | Delete post by ID | ✅ Yes |

### 📊 Activity (`/api/activity`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/activity` | Retrieve recent activity logs | ✅ Yes |

---

## ⏱️ Background Scheduler

The application runs a lightweight background queue dispatcher powered by **`node-cron`** in `backend/services/schedulerService.ts`.

### How it works:
1. Every minute (`* * * * *`), the cron worker queries MongoDB for posts matching:
   - `status: "SCHEDULED"`
   - `scheduledFor: { $lte: new Date() }`
2. For each matching post, it iterates through connected `targetAccounts` and sends the payload to **Zernio API**.
3. Upon success, post status transitions to `PUBLISHED`.
4. If posting fails due to token expiration or API limits, status updates to `FAILED` with an audit log in `ActivityLog`.

---

## 🤖 AI Content Generation

The AI Composer uses the official `@google/genai` client SDK.

- **Model**: `gemini-2.5-flash`
- **Capabilities**:
  - **Caption Creation**: Draft engaging posts tailored for specific platforms (LinkedIn tone vs Twitter/X conciseness).
  - **Hashtag Generator**: Suggest relevant hashtags to maximize reach.
  - **Content Polishing**: Rewrite existing drafts to improve readability, sentiment, and call-to-actions (CTAs).

---

## 📜 Available Scripts

### **Backend Scripts (`/backend`)**

- `npm run dev`: Starts Express server with `nodemon` and `tsx` for hot-reloading.
- `npm start`: Starts production Express server running `server.ts` via `tsx`.
- `npm run build`: Compiles TypeScript files using `tsc`.

### **Frontend Scripts (`/frontend`)**

- `npm run dev`: Boots Vite local development server.
- `npm run build`: Performs TypeScript type-checking and builds production bundle via Vite.
- `npm run preview`: Previews built production frontend locally.
- `npm run lint`: Runs ESLint across frontend components.

---

## ❓ Troubleshooting & FAQs

### 1. MongoDB Connection Failure
- Verify your network IP is whitelisted in MongoDB Atlas under Network Access (`0.0.0.0/0` for development).
- Check that `MONGODB_URL` in `backend/.env` includes correct credentials and DB name.

### 2. Posts failing to schedule/publish
- Verify `ZERNIO_API_KEY` is active and valid.
- Ensure media files uploaded to Cloudinary return public HTTP/HTTPS URLs accessible by social APIs.

### 3. Gemini AI Generation Errors
- Check that `GEMINI_API_KEY` is present in `backend/.env`.
- Ensure your Google AI Studio key has quota and access to Gemini models.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to modify and distribute for personal or commercial projects.
