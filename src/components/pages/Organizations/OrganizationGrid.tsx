"use client";
import React, { useState } from "react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import {
  useDeleteOrganization,
  useIsFavorite,
} from "@/apiHooks.ts/organization/organization.api";
import { useAppSelector } from "@/redux/store";
import { DeleteOrganizationModal } from "@/components/modals/DeleteOrganizationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationGridComponent } from "./OrganizationGridComponent";
import { LoadingSpinner, Tooltip } from "@/components/ui";
import { Plus } from "lucide-react";
import { PermissionGuard } from "@/components/HOCs/permission-guard";

export interface OrganizationGridProps {
  organizations: OgOrganization[];
  onAddNew: () => void;
  onOrganizationDeleted?: (organizationId: string) => void;
  loading?: boolean;
  metaData?: any;
}

export default function OrganizationGrid({
  organizations,
  onAddNew,
  onOrganizationDeleted,
  loading,
  metaData,
}: OrganizationGridProps) {
  const OrganizationSkeleton = ({
    isAddNew = false,
  }: {
    isAddNew?: boolean;
  }) => (
    <div className={`bg-bg-secondary p-3 py-6 rounded-xl border border-border ${isAddNew ? "border-dashed" : ""}`}>
      {isAddNew ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center ">
            <Plus size={50} className="text-skeleton" />
            <h1 className="text-skeleton">Add new</h1>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-2">
            <Skeleton width="40px" height="40px" circle />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton width="60%" height="16px" />
              <Skeleton width="40%" height="12px" />
            </div>
            <Skeleton width="24px" height="24px" circle />
          </div>
          <div className="mt-5 -mb-3">
            <Skeleton width="100%" height="26px" />
          </div>

        </>
      )}
    </div>
  );
  const { user } = useAppSelector((s) => s.auth);
  const { mutate: toggleFavorite, isPending } = useIsFavorite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);

  // DELETE API HOOK
  const { mutate: deleteOrg, isPending: deleteLoading } =
    useDeleteOrganization();

  //1.TOGGLE FAVORITE
  const handleFavoriteClick = (e: React.MouseEvent, orgId: string) => {
    e.stopPropagation();
    if (!user?.id) return;
    toggleFavorite({ userId: user.id, orgId });
  };
  //2.DELETE
  const handleDeleteClick = (org: any) => {
    // if (org.id === organization?.id) {
    //   toast.error('You cannot delete your current organization');
    //   return
    // }
    setSelectedOrg(org);
    setIsModalOpen(true);
  };
  //3.CONFIRM DELETE
  const handleConfirmDelete = () => {
    if (!selectedOrg) return;
    deleteOrg(selectedOrg.id, {
      onSuccess: () => {
        if (onOrganizationDeleted) {
          onOrganizationDeleted(selectedOrg.id);
        }
      },
    });
  };
  return (
    <div>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-3 ">
        <div className="flex items-center gap-2">
          <h1 className="text-heading-1 font-bold text-black">
            {loading ? (
              <Skeleton width="200px" height="24px" circle />
            ) : "Your Organizations"}
          </h1>
          {loading ? (
            <Skeleton width="24px" height="24px" circle />
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium bg-primary">
              {metaData?.totalCount!}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          <>
            <PermissionGuard
              key="add-new-skeleton"
              requiredPermissions="og:create::organization"
              fallback={<OrganizationSkeleton isAddNew={false} />}
            >
              <OrganizationSkeleton isAddNew={true} />
            </PermissionGuard>
            {Array.from({ length: 5 }).map((_, idx) => (
              <OrganizationSkeleton key={idx + 1} isAddNew={false} />
            ))}
          </>
        ) : (
          <>
            {organizations?.map((org) => (
              <Tooltip
                key={org?.id}
                content={org?.isAddNew ? "Create new organization" : org?.name}
                position="top"
                wrapperClassName="w-full"
              >
                <div
                  className={`relative group h-30 w-full ${org?.isAddNew ? "" : "bg-bg-secondary border border-border rounded-xl"
                    }  ${org?.isAddNew ? "" : "p-3"
                    } hover:shadow-sm transition-shadow cursor-pointer rounded-xl`}
                >
                  {org?.isAddNew ? (
                    <div
                      className="flex flex-col border border-dashed border-border items-center justify-center text-center h-full rounded-xl bg-primary/5  w-full"
                      onClick={onAddNew}
                    >
                      <div className="text-primary">
                        <Plus size={50} />
                      </div>
                      <span className=" text-primary font-bold">
                        Add New
                      </span>
                    </div>
                  ) : (
                    <OrganizationGridComponent
                      id={org?.id}
                      org={org}
                      isPending={isPending}
                      handleFavoriteClick={handleFavoriteClick}
                      user={user}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </div>
              </Tooltip>
            ))}
          </>
        )}
      </div>

      <PermissionGuard requiredPermissions="og:delete::organization">
        {" "}
        {selectedOrg && (
          <DeleteOrganizationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOrg(null);
            }}
            onConfirm={handleConfirmDelete}
            organizationData={selectedOrg}
            extraDetails={`${selectedOrg.memberships?.length || 0} member${selectedOrg?.memberships?.length === 1 ? "" : "s"} • ${selectedOrg.products?.length || 0} product${selectedOrg.products?.length === 1 ? "" : "s"}`}
            isDeleting={deleteLoading}
          />
        )}
      </PermissionGuard>
    </div>
  );
}
