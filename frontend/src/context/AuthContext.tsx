import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/axios";

export interface User {
    id?: string;
    name: string;
    email: string;
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

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }

        setIsLoading(false)
    }, [])


    // useEffect(() => {
    //     if (user) {
    //         localStorage.setItem("social_ai_user", JSON.stringify(user));
    //     } else {
    //         localStorage.removeItem("social_ai_user");
    //     }
    // }, [user]);

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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
