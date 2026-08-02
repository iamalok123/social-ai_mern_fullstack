import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL || "http://localhost:3000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GOOGLE_LOGIN: "/api/auth/google",
        CHANGE_PASSWORD: "/api/auth/change-password",
    },

    OAUTH: {
        GET_CONNECT_URL: (platform: string) => `/api/oauth/${platform}/url`,
        SYNC: "/api/oauth/sync",
    },

    ACCOUNTS: {
        GET_ALL: "/api/accounts",
        CREATE: "/api/accounts",
        DELETE: (id: string) => `/api/accounts/${id}`,
    },

    POSTS: {
        GET_ALL: "/api/posts",
        SCHEDULE: "/api/posts",
        GENERATE: "/api/posts/generate",
        GET_GENERATIONS: "/api/posts/generations",
        DELETE_GENERATION: (id: string) => `/api/posts/generations/${id}`,
    },

    ACTIVITY: {
        GET_ALL: "/api/activity",
    },

    IDEAS: {
        GET_ALL: "/api/ideas",
        CREATE: "/api/ideas",
        UPDATE: (id: string) => `/api/ideas/${id}`,
        DELETE: (id: string) => `/api/ideas/${id}`,
        UPLOAD_IMAGE: "/api/ideas/upload",
        GENERATE_AI: "/api/ideas/generate-ai",
    },
};

export const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
