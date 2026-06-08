"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header/Header";
import OrgSidebar from "@/components/pages/OrganizationDetails/OrgSidebar";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import { useSSE } from "@/hooks/useSSE";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { Loader } from "@/components/ui";

export default function OrganizationDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { orgId } = useParams();
  const { data: organizationDetails, isLoading } = useOrganizationDetails(
    orgId as string,
  );
  const router = useRouter();

  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  const userRole = organizationDetails?.memberships?.find(
    (m) => m.user_id === user?.id,
  )?.role;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (!isLoading && organizationDetails && pathname) {
      const isBillingPage = pathname.includes("/billing");
      const isPaymentPage = pathname.includes("/payment-cards");

      if ((isBillingPage || isPaymentPage) && userRole !== "OWNER") {
        router.replace(`/organization-details/${orgId}/notifications`);
      }
    }
  }, [
    pathname,
    userRole,
    organizationDetails,
    isLoading,
    orgId,
    router,
    user,
    router,
  ]);
  const onToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useSSE(
    (orgId as string) || undefined,
    organizationDetails?.subscriptions?.[0]?.id || "",
  );

  const onToggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!isLoading && !organizationDetails) {
      router.replace("/organization");
    }
  }, [isLoading, organizationDetails, router]);
  // useEffect(() => {
  //   async function getOrgId() {
  //     const orgID = (await params).orgId;
  //     setOrgId(orgID);
  //   }
  //   getOrgId();
  // }, [params]);
  if (isLoading) {
    return <Loader text="Loading organization details" />;
  }
  return (
    <div className="min-h-screen bg-background flex font-inter">
      <div className="hidden md:block">
        <OrgSidebar
          collapsed={collapsed}
          organizationDetails={organizationDetails!}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onToggleMobileSidebar}
          />
          <OrgSidebar
            collapsed={false}
            className="fixed inset-y-0 left-0 z-50 w-64 h-full"
            organizationDetails={organizationDetails!}
          />
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-screen ">
        <Header
          onToggleSidebar={onToggleSidebar}
          onToggleMobileSidebar={onToggleMobileSidebar}
          mobileSidebarOpen={sidebarOpen}
          collapsed={collapsed}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
