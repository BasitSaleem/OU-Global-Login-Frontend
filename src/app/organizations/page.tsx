"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGetInvitations } from "@/apiHooks.ts/invitation/invitation.api";
import { inviteData } from "@/apiHooks.ts/invitation/invitation.type";
import {
  useCreateOrganization,
  useGetOrganizations,
} from "@/apiHooks.ts/organization/organization.api";
import {
  CreateOrganizationData,
  CreateOrganizationResponse,
} from "@/apiHooks.ts/organization/organization.types";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CreateOrgModal from "@/components/modals/CreateOrgModal";
import AddProductModal from "@/components/modals/AddProductModal";
import OrganizationGrid from "@/components/pages/Organizations/OrganizationGrid";
import PendingInvitations from "@/components/pages/Organizations/PendingInvitation";
import ProgressModal from "@/components/ui/ProgressModal";
import { toast } from "@/hooks/useToast";
import { useAppSelector } from "@/redux/store";
import {
  useIncomingPackageSelection,
  clearIncomingPackageSelection,
} from "@/hooks/useIncomingPackageSelection";

const organizationsList = [
  {
    id: "add-new",
    isAddNew: true,
  },
];

function OrganizationsContent() {
  const { user } = useAppSelector((s) => s.auth);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const {
    pkgId,
    product,
    billingCycle,
    opPkgId,
    opBillingCycle,
    hasDirectLink,
  } = useIncomingPackageSelection();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // A package link (from the OI/OP landing pages) lands existing-org users
  // here (see the `existingOrgRedirectTo` redirect in auth-guard.tsx) — open
  // the "Add Organization" modal pre-filled with their selection.
  useEffect(() => {
    if (hasDirectLink) {
      setIsCreateModalOpen(true);
    }
  }, [hasDirectLink]);
  const [organizations, setOrganizations] = useState<any>(organizationsList);
  const [searchQuery, setSearchQuery] = useState("");

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [organizationData, setOrganizationData] =
    useState<CreateOrganizationResponse | null>(null);
  const [addProductOrg, setAddProductOrg] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const { mutate: createOrg, isPending } = useCreateOrganization();
  const {
    data: userOrgs,
    status: orgStatus,
    isPending: isOrgPending,
    error: orgError,
  } = useGetOrganizations(page, 10, searchQuery);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const { data, isPending: isInvitationPending } = useGetInvitations();
  const invitations: inviteData[] = useMemo(() => data!, [data]);

  useEffect(() => {
    if (orgStatus === "success" && userOrgs) {
      setOrganizations((prev: any) => {
        const base = page === 1 ? [{ id: "add-new", isAddNew: true }] : prev;
        const merged = [...base, ...userOrgs.organization];
        const map = new Map();
        merged.forEach((org) => {
          map.set(org.id, org);
        });
        const unique = Array.from(map.values());
        const addNewCard = unique.filter((org) => org.isAddNew);
        let regularOrgs = unique.filter((org) => !org.isAddNew);

        if (filter === "owned") {
          regularOrgs = regularOrgs.filter(
            (org) =>
              org.ogUserId === user?.id ||
              org.memberships?.some(
                (m: any) => m.user_id === user?.id && m.role === "OWNER",
              ),
          );
        }

        if (searchQuery) {
          regularOrgs = regularOrgs.filter((org) =>
            org.name?.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        const sorted = regularOrgs.sort((a, b) => {
          const aIsFavorite =
            a.favorites?.some((fav: any) => fav.userId === user?.id) || false;
          const bIsFavorite =
            b.favorites?.some((fav: any) => fav.userId === user?.id) || false;
          if (aIsFavorite && !bIsFavorite) return -1;
          if (!aIsFavorite && bIsFavorite) return 1;
          return 0;
        });

        return [...addNewCard, ...sorted];
      });
    }
  }, [orgStatus, userOrgs, page, user?.id, filter, searchQuery]);

  const handleCreateOrg = (data: CreateOrganizationData) => {
    createOrg(data, {
      onSuccess: (res) => {
        setIsCreateModalOpen(false);
        // OP no longer collects any in-app payment (GHL bills it), so every
        // product flows straight to the provisioning progress modal.
        setOrganizationData({
          data: {
            organization: res.organization,
            product: res.product,
            leadRegistration: res.leadRegistration || null,
          },
        });
        setShowProgressModal(true);
        clearIncomingPackageSelection();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create organization");
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
      prev.filter((org) => org.id !== deletedOrgId),
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
          metaData={userOrgs?.meta}
          onSearchChange={setSearchQuery}
          onAddProduct={(org) => setAddProductOrg(org)}
        />
        {userOrgs?.meta?.totalCount! > 10 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                setPage((prev) => (userOrgs?.meta.hasMore ? prev + 1 : 1))
              }
            >
              <p className="text-primary-500 font-medium hover:underline cursor-pointer">
                {userOrgs?.meta.hasMore ? "View More" : "View Less"}
              </p>
            </button>
          </div>
        )}

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
        initialProduct={product}
        initialPkgId={pkgId}
        initialOpPkgId={opPkgId}
        initialBillingCycle={product === "OP" ? opBillingCycle : billingCycle}
        isDirectFlow={hasDirectLink}
      />
      <ProgressModal
        isOpen={showProgressModal}
        organizationData={organizationData}
        onClose={handleModalClose}
        isFromMain={false}
      />

      {addProductOrg && (
        <AddProductModal
          isOpen={!!addProductOrg}
          orgId={addProductOrg.id}
          orgName={addProductOrg.name}
          existingProducts={(addProductOrg.products ?? [])
            .map((p: any) => p.product_name)
            .filter(Boolean)}
          onClose={() => setAddProductOrg(null)}
        />
      )}
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
