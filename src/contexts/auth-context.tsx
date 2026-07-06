"use client";
import { createContext, useContext } from "react";
import { signinData } from "@/apiHooks.ts/auth/auth.types";

export type AuthContextType = {
    onSubmit: (data: signinData) => void;
    isPending: boolean;
    error: any;
    triggerMfa?: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthContext must be used inside AuthLayout");
    }
    return ctx;
};