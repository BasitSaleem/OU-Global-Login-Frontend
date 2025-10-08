// 'use client';

// import { ReactNode } from 'react';
// import { Provider as ReduxProvider } from 'react-redux';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ThemeProvider } from 'next-themes';
// import ToastProvider from '@/components/providers/toast-provider';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from '@/redux/store';
// import { LoadingSpinner } from '@/components/ui';

// interface ProvidersProps {
//   children: ReactNode;
// }

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 60 * 1000,
//       retry: 1,
//     },
//   },
// });

// export function Providers({ children }: ProvidersProps) {
//   return (
//     <ReduxProvider store={store}>
//       <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
//         <QueryClientProvider client={queryClient}>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             <ToastProvider>
//               {children}
//             </ToastProvider>
//           </ThemeProvider>
//         </QueryClientProvider>
//       </PersistGate>

//     </ReduxProvider>
//   );
// }



// src/providers.tsx
"use client";

import React, { useEffect } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import ToastProvider from "@/components/providers/toast-provider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, RootState, store, useAppSelector } from "@/redux/store";
import { LoadingSpinner } from "@/components/ui";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
});


function HtmlThemeApplier() {
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;  // This is the <html> element
    console.log("Root classes before:", root.classList.toString());

    if (isDarkMode) {
      root.classList.add("dark");  // Adds dark mode class to <html>
    } else {
      root.classList.remove("dark");  // Removes dark mode class from <html>
    }

    console.log("Root classes after:", root.classList.toString());
  }, [isDarkMode]); // This runs every time the dark mode state changes

  return null;
}


export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" enableSystem={false}>
            <HtmlThemeApplier />
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}


