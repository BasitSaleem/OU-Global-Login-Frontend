// app/(whatever-segment)/page.tsx
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import HomePageSkeleton from '@/components/pages/Homepage/homepage-skeleton';

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<HomePageSkeleton />}>
        {/* If HomePage is an async Server Component, you can keep this comment to silence TS: */}
        <HomePage />
      </Suspense>
    </DashboardLayout>
  );
}
