"use client";
import { useGetOrganizations } from "@/apiHooks.ts/organization/organization.api";
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
    // {
    //   id: "post-purchase",
    //   name: "Post Purchase Management App",
    //   abbreviation: "PP",
    //   backgroundColor: "#137F6A",
    //   members: 22,
    //   teamAvatars: [
    //     Icons.owneruniverse,
    //     Icons.ownerinventory,
    //     Icons.ownerjungle,
    //     Icons.ownermarketplace
    //   ],
    // },

  ];

  const pendingInvitations: Invitation[] = [
    // {
    //   id: "al-asif-exteriors",
    //   name: "Al-Asif Exteriors",
    //   abbreviation: "AE",
    //   backgroundColor: "#B11E67",
    //   invitedBy: "Sarah Chen",
    //   product: "Owners Inventory",
    //   timeAgo: "2 hours ago",
    // },
    // {
    //   id: "sales-dept",
    //   name: "Sales Department",
    //   abbreviation: "SD",
    //   backgroundColor: "#1AD1B9",
    //   invitedBy: "Mike Wilson",
    //   product: "Owners Marketplace",
    //   timeAgo: "2 hours ago",
    // },
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
  const { data: userOrgs, status: orgStatus, isPending: isOrgPending, error: orgError } = useGetOrganizations();

  useEffect(() => {
    if (orgStatus === "success") {
      setOrganizations((prev: any) => [...prev, ...userOrgs?.organizations])
    }
  }, [orgStatus])

  const handleCreateOrg = (data: {
    companyName: string;
    subDomain: string;
    product: string;
  }) => {
    console.log("New Organization Data:", data);
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
