'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from '@/hooks/useToast';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/redux/store';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalLoading } from '@/components/ui/loading';
import { CreateOrganizationGuard } from '@/components/guards/createOrgRoute.guard';
import { AuthGuard } from '@/components/guards/auth-guard';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={<GlobalLoading />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <CreateOrganizationGuard>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CreateOrganizationGuard>
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </ThemeProvider>
  );
}
