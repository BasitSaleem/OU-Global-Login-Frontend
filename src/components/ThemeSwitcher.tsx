"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/helpers";
import { Button } from "./ui";

export function ThemeSwitcher({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-[100px] h-8 rounded-lg animate-pulse" />;
    }

    return (
        <div className={cn("grid grid-cols-2 gap-1  bg-bg-secondary p-1 rounded-lg border", className)}>
            <Button
                variant="basic"
                onClick={() => setTheme("light")}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded-md transition-all",
                    theme === "light"
                        ? "bg-background shadow-sm text-primary"
                        : "text-text"
                )}
                title="Light Mode"
            >
                <Sun className="w-4 h-4 hover:scale-125 duration-300 transition-all" />
            </Button>
            <Button
                variant="basic"
                onClick={() => setTheme("dark")}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded-md transition-all",
                    theme === "dark"
                        ? "bg-background shadow-sm text-primary"
                        : "text-text"
                )}
                title="Dark Mode"
            >
                <Moon className="w-4 h-4 hover:scale-125 duration-300 transition-all" />
            </Button>
            {/* <Button
                variant="basic"
                onClick={() => setTheme("system")}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded-md transition-all",
                    theme === "system"
                        ? "bg-background shadow-sm text-primary"
                        : "text-text"
                )}
                title="System Mode"
            >
                <Monitor className="w-4 h-4" />
            </Button> */}
        </div>
    );
}
