'use client'
import { useState, useEffect } from "react";

export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Mount hone pe localStorage se value load karo
    useEffect(() => {
        const stored = localStorage.getItem("darkMode");
        if (stored) {
            setIsDarkMode(stored === "true");
        }
    }, []);

    // jab bhi dark mode change ho, localStorage update karo
    useEffect(() => {
        localStorage.setItem("darkMode", String(isDarkMode));

        // body class add/remove kar ke theme apply karo
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    return { isDarkMode, toggleDarkMode, setIsDarkMode };
};
