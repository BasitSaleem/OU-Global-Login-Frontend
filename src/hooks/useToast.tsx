"use client";
import React from "react";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui";

type ToastType = "success" | "info" | "error";

type Toast = {
    id: string;
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
};

type ToastContextType = {
    addToast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((t: Omit<Toast, "id">) => {
        const toast: Toast = { id: Math.random().toString(36).slice(2), ...t };
        setToasts((prev) => {
            const newToasts = [...prev, toast];
            // Limit to 5 toasts maximum
            return newToasts.slice(-5);
        });
        const duration = t.duration ?? 6000; // Changed default to 5000
        setTimeout(() => {
            setToasts((prev) => prev.filter((x) => x.id !== toast.id));
        }, duration);
    }, []);

    React.useEffect(() => {
        const handleToastEvent = (event: CustomEvent) => {
            addToast(event.detail);
        };

        window.addEventListener('addToast', handleToastEvent as EventListener);
        return () => {
            window.removeEventListener('addToast', handleToastEvent as EventListener);
        };
    }, [addToast]);

    const value = useMemo(() => ({ addToast }), [addToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast Container - positioned top-right to match toastify config */}
            <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex w-full max-w-[420px] flex-col gap-3">
                {toasts.map((t) => {
                    const Icon =
                        t.type === "success"
                            ? CheckCircle2
                            : t.type === "error"
                                ? XCircle
                                : Info;
                    const color =
                        t.type === "success"
                            ? "text-emerald-600"
                            : t.type === "error"
                                ? "text-red-600"
                                : "text-blue-600";
                    const bgColor =
                        t.type === "success"
                            ? "bg-emerald-50 border-emerald-200"
                            : t.type === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-blue-50 border-blue-200";
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto animate-toast-slide-in rounded-lg border ${bgColor} p-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus-within:outline-2 focus-within:outline-purple-500 focus-within:outline-offset-2 min-h-[64px] backdrop-blur-sm`}
                            role="alert"
                            aria-live="polite"
                        >
                            <div className="flex items-start gap-3">
                                <Logo className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 truncate">
                                        {t.title}
                                    </div>
                                    {t.description && (
                                        <div className="mt-1 text-xs text-slate-600 line-clamp-2">
                                            {t.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Custom CSS Styles */}
            <style jsx global>{`
                /* Toast animations */
                @keyframes toast-slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes toast-slide-out {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @keyframes progress-bar {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
                
                .animate-toast-slide-in {
                    animation: toast-slide-in 0.3s ease-out;
                }
                
                .animate-toast-slide-out {
                    animation: toast-slide-out 0.3s ease-in;
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .toast-dark {
                        background: #1f2937;
                        border-color: #374151;
                        color: #f9fafb;
                    }
                    
                    .toast-dark .text-slate-900 {
                        color: #f9fafb;
                    }
                    
                    .toast-dark .text-slate-600 {
                        color: #d1d5db;
                    }
                }
                
                /* Responsive design */
                @media (max-width: 640px) {
                    .toast-container {
                        left: 16px !important;
                        right: 16px !important;
                        top: 16px !important;
                        max-width: calc(100vw - 32px) !important;
                    }
                }
                
                /* Utility classes */
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

export const toast = {
    success: (title: string, description?: string, duration?: number) => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('addToast', {
                detail: { title, description, type: 'success', duration }
            });
            window.dispatchEvent(event);
        }
    },
    error: (title: string, description?: string, duration?: number) => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('addToast', {
                detail: { title, description, type: 'error', duration }
            });
            window.dispatchEvent(event);
        }
    },
    info: (title: string, description?: string, duration?: number) => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('addToast', {
                detail: { title, description, type: 'info', duration }
            });
            window.dispatchEvent(event);
        }
    }
};
