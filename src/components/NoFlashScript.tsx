'use client';

import { useEffect } from 'react';

export function NoFlashScript() {
    useEffect(() => {
        const removeTransition = () => {
            document.documentElement.classList.remove('no-transition');
        };
        const theme = (() => {
            if (typeof localStorage !== 'undefined') {
                // Check the specific storage key used by your theme provider
                const storedTheme = localStorage.getItem('ou-global-theme');
                if (storedTheme && ['light', 'dark', 'dark-ocean', 'dark-crimson'].includes(storedTheme)) {
                    return storedTheme;
                }
            }
            return 'light'; 
        })();
        
        // Remove all possible theme classes first
        document.documentElement.classList.remove('light', 'dark', 'dark-ocean', 'dark-crimson');
        
        // Add the current theme class
        if (theme) {
            document.documentElement.classList.add(theme);
        }
        
        // Temporarily disable transitions during initial load
        document.documentElement.classList.add('no-transition');
        const timeoutId = setTimeout(removeTransition, 150);

        return () => clearTimeout(timeoutId);
    }, []);

    return null;
}