"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header/Header';
import OrgSidebar from '@/components/pages/OrganizationDetails/OrgSidebar';
import { useOrganizationDetails } from '@/apiHooks.ts/organization/organization.api';
export default function OrganizationDetailsLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ orgId: string }>;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [orgId, setOrgId] = useState<string>("")
    const { data: organizationDetails } = useOrganizationDetails(orgId)
    const onToggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    const onToggleMobileSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    useEffect(() => {
        async function getOrgId() {
            const orgID = (await params).orgId;
            setOrgId(orgID)
        }
        getOrgId()

    }, [params])


    return (
        <div className="min-h-screen bg-background flex font-inter">
            <div className="hidden md:block">
                <OrgSidebar collapsed={collapsed} organizationDetails={organizationDetails!} />
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={onToggleMobileSidebar} />
                    <OrgSidebar collapsed={false} className="fixed inset-y-0 left-0 z-50 w-64 h-full" organizationDetails={organizationDetails!} />
                </div>
            )}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Header
                    onToggleSidebar={onToggleSidebar}
                    onToggleMobileSidebar={onToggleMobileSidebar}
                    mobileSidebarOpen={sidebarOpen}
                />
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
