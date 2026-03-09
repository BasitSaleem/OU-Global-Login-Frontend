'use client';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { CreateOrganizationGuard } from '@/components/HOCs/createOrgRoute.guard';

export default function Page() {
  return (
    <ErrorBoundary>
      <DashboardLayout>
        <CreateOrganizationGuard>
          {/* <Suspense fallback={<Loader text='loading aisndainsdpaisdpaisdin' />}> */}
          <HomePage />
          {/* </Suspense> */}
        </CreateOrganizationGuard>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
