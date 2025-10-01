// app/(whatever-segment)/page.tsx
'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import HomePageSkeleton from '@/components/pages/Homepage/homepage-skeleton';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthGuard } from '@/components/guards/auth-guard';

export default function Page() {
  return (
    <AuthGuard fallback={<HomePageSkeleton />}>
      <ErrorBoundary>
        <DashboardLayout>
          <Suspense fallback={<HomePageSkeleton />}>
            {/* If HomePage is an async Server Component, you can keep this comment to silence TS: */}
            <HomePage />
          </Suspense>
        </DashboardLayout>
      </ErrorBoundary>
    </AuthGuard>
  );
}
