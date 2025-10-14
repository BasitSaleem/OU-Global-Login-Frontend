"use client";
import { useGetOrganizations } from "@/apiHooks.ts/organization/organization.api";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CreateOrgModal from "@/components/modals/CreateOrgModal";
import DeclineModal from "@/components/modals/DeclineModal";
import OrganizationGrid from "@/components/pages/Organizations/OrganizationGrid";
import PendingInvitations from "@/components/pages/Organizations/PendingInvitation";
import { Invitation } from '@/types/common';
import { useEffect, useState } from "react";

function OrganizationsContent() {
  const organizationsList = [
    {
      id: "add-new",
      isAddNew: true,
    },
  ];

  const pendingInvitations: Invitation[] = [
    // {
    //   id: "space-group",
    //   name: "Space Group",
    //   abbreviation: "SG",
    //   backgroundColor: "#F95C5B",
    //   invitedBy: "Wilson",
    //   product: "Owners Inventory",
    //   timeAgo: "2 hours ago",
    // },
  ];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<any>(organizationsList);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [page, setPage] = useState(1)

  const { data: userOrgs, status: orgStatus, isPending: isOrgPending, error: orgError } = useGetOrganizations(page, 10);
  useEffect(() => {
    if (orgStatus === "success" && userOrgs) {
      setOrganizations((prev: any) => {
        const base = page === 1 ? [{ id: "add-new", isAddNew: true }] : prev;
        const merged = [...base, ...userOrgs.organization];
        const unique = merged.filter(
          (org, i, arr) => i === arr.findIndex(o => o.id === org.id)
        );
        return unique;
      });
    }
  }, [orgStatus, userOrgs, page]);

  const handleCreateOrg = (data: {
    companyName: string;
    subDomain: string;
    product: string;
  }) => {
  };
  const handleDecline = () => setIsDeclineModalOpen(false);

  return (
    <div className="p-2 sm:p-8">
      <div className="max-w-xs sm:max-w-7xl mx-auto space-y-8">
        <OrganizationGrid
          organizations={organizations}
          onAddNew={() => setIsCreateModalOpen(true)}
          loading={isOrgPending}
        />
        <div className="mt-4 flex justify-end">
          <button onClick={() => {
            setPage((prev) => prev + 1)
          }} className="text-[#795CF5] text-body-medium font-medium hover:underline cursor-pointer">
            View More
          </button>
        </div>

        <PendingInvitations
          invitations={pendingInvitations}
          onAccept={(id) => console.log("Accept invitation:", id)}
          onDecline={() => setIsDeclineModalOpen(true)}
        />
      </div>

      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDecline}
      />
      <CreateOrgModal
        isLoading={isOrgPending}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrg}
      />

    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <OrganizationsContent />
    </DashboardLayout>
  );
}
