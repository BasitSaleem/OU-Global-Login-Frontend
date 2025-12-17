"use client";
import { useGetInvitations } from "@/apiHooks.ts/invitation/invitation.api";
import { inviteData } from "@/apiHooks.ts/invitation/invitation.type";
import { useCreateOrganization, useGetOrganizations } from "@/apiHooks.ts/organization/organization.api";
import { CreateOrganizationData, CreateOrganizationResponse } from "@/apiHooks.ts/organization/organization.types";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CreateOrgModal from "@/components/modals/CreateOrgModal";
import OrganizationGrid from "@/components/pages/Organizations/OrganizationGrid";
import PendingInvitations from "@/components/pages/Organizations/PendingInvitation";
import ProgressModal from "@/components/ui/ProgressModal";
import { toast } from "@/hooks/useToast";
import { useEffect, useMemo, useState } from "react";

function OrganizationsContent() {
  const organizationsList = [
    {
      id: "add-new",
      isAddNew: true,
    },
  ];



  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<any>(organizationsList);
  // const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] = useState<CreateOrganizationResponse | null>(null);
  const [page, setPage] = useState(1)
  const { mutate: createOrg, isPending } = useCreateOrganization()
  const { data: userOrgs, status: orgStatus, isPending: isOrgPending, error: orgError } = useGetOrganizations(page, 10);
  const { data, isPending: isInvitationPending, error: invitationError } = useGetInvitations();
  const invitations: inviteData[] = useMemo(() => data!, [data]);

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
  const handleCreateOrg = (data: CreateOrganizationData) => {
    createOrg(data, {
      onSuccess: (res) => {
        setOrganizationData({
          data: {
            organization: res.organization,
            product: res.product,
            leadRegistration: res.leadRegistration || null
          }
        });
        setIsCreateModalOpen(false);
        setShowProgressModal(true);
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to create organization');
      },
    });
  };
  const handleModalClose = () => {
    setShowProgressModal(false);
    setOrganizationData(null);
  };
  // const handleDecline = () => setIsDeclineModalOpen(false);

  const handleOrganizationDeleted = (deletedOrgId: string) => {
    setOrganizations((prev: any[]) =>
      prev.filter(org => org.id !== deletedOrgId)
    );
  };

  return (
    <div className="p-2 sm:p-8 bg-background ">
      <div className="max-w-xs sm:max-w-7xl mx-auto space-y-8">
        <OrganizationGrid
          organizations={organizations}
          onAddNew={() => setIsCreateModalOpen(true)}
          onOrganizationDeleted={handleOrganizationDeleted}
          loading={isOrgPending}
        />
        {userOrgs?.totalCount! > 10 && <div className="mt-4 flex justify-end">
          <button onClick={() => {
            setPage((prev) => prev + 1)
          }} >
            <p className="text-primary-500 font-medium hover:underline cursor-pointer">View More</p>
          </button>
        </div>}

        <PendingInvitations
          isLoading={isInvitationPending}
          invitations={invitations}
        />
      </div>
      <CreateOrgModal
        isLoading={isPending}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrg}
      />
      <ProgressModal
        isOpen={showProgressModal}

        organizationData={organizationData}
        onClose={handleModalClose}
        isFromMain={false}
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


