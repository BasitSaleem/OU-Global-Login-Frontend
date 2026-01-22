'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { CreateOrganizationGuard } from '@/components/HOCs/createOrgRoute.guard';
import { Loader } from '@/components/ui';

export default function Page() {
  return (
    <ErrorBoundary>
      <DashboardLayout>
        <CreateOrganizationGuard>
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        </CreateOrganizationGuard>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
