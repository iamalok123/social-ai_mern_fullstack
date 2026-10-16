import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/axios";
import { isTokenExpired } from "../utils/authUtils.js";

export interface User {
    id?: string;
    name: string;
    email: string;
    picture?: string;
    authProvider?: "email" | "google";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken && !isTokenExpired(storedToken)) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            }
        } else if (storedToken && isTokenExpired(storedToken)) {
            // Proactively clean up expired token from storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            setUser(null);
            setToken(null);
        }

        setIsLoading(false);

        const handleSessionExpired = () => {
            setUser(null);
            setToken(null);
            delete api.defaults.headers.common["Authorization"];
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "token" && !e.newValue) {
                handleSessionExpired();
            }
        };

        window.addEventListener("auth:session-expired", handleSessionExpired);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("auth:session-expired", handleSessionExpired);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    const login = (userData: User, newToken: string) => {
        setUser(userData)
        setToken(newToken)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", newToken)
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"];
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!token,
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
