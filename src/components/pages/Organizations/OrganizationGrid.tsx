"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Icons } from "@/components/utils/icons";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { useDeleteOrganization, useIsFavorite } from "@/apiHooks.ts/organization/organization.api";
import { useAppSelector } from "@/redux/store";
import { DeleteOrganizationModal } from "@/components/modals/DeleteOrganizationModal";
import { Skeleton } from "@/components/ui/skeletion";
import { OrganizationGridComponent } from "./OrganizationGridComponent";
import { toast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui";

export interface OrganizationGridProps {
  organizations: OgOrganization[];
  onAddNew: () => void;
  loading?: boolean;
}

export default function OrganizationGrid({
  organizations,
  onAddNew,
  loading
}: OrganizationGridProps) {
  const { user, organization } = useAppSelector((s) => s.auth)
  const { mutate: toggleFavorite, isPending } = useIsFavorite()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  console.log(organizations, "organizations");

  // DELETE API HOOK
  const { mutate: deleteOrg, isPending: deleteLoading } = useDeleteOrganization(() => {
    setIsModalOpen(false);
    setSelectedOrg(null);
  });

  //1.TOGGLE FAVORITE
  const handleFavoriteClick = (e: React.MouseEvent, orgId: string) => {
    e.stopPropagation();
    if (!user?.id) return;
    toggleFavorite({ userId: user.id, orgId });
  };
  //2.DELETE
  const handleDeleteClick = (org: any) => {
    if (org.id === organization?.id) {
      toast.error('You cannot delete your current organization');
      return
    }
    setSelectedOrg(org);
    setIsModalOpen(true);
  };
  //3.CONFIRM DELETE
  const handleConfirmDelete = () => {
    if (!selectedOrg) return;
    deleteOrg(selectedOrg.id);

  };

  return (
    <>
      <div>
        {/* Header with count */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-heading-1 font-bold text-black">
              {loading ? "Loading Organizations" : "Your Organizations"}
            </h1>
            {!loading ? <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-body-tiny font-medium bg-[#795CF5]"
            >
              {Math.max((organizations?.length || 0)) - 1}
            </div> : <LoadingSpinner size={4} />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading ? Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-start gap-3 mb-2">
                <Skeleton width="40px" height="40px" circle />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton width="60%" height="16px" />
                  <Skeleton width="40%" height="12px" />
                </div>
                <Skeleton width="24px" height="24px" circle />
              </div>
              <div className="mt-auto flex items-center justify-between px-2 py-1.5 rounded bg-gray-200">
                <Skeleton width="20%" height="12px" />
                <div className="flex space-x-1">
                  <Skeleton width="24px" height="24px" circle count={3} />
                </div>
              </div>
            </div>
          ))
            : <>
              {organizations?.map((org) => (
                <div
                  key={org?.id}
                  onClick={() => org?.isAddNew && onAddNew()}
                  className={`relative group ${org?.isAddNew ? "" : "bg-white border border-gray-200"
                    } rounded ${org?.isAddNew ? "" : "p-3"
                    } hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  {org?.isAddNew ? (
                    <div
                      className="flex flex-col items-center justify-center text-center h-full rounded bg-[#795CF511]"
                    >
                      <div className="mb-2">
                        <Image
                          src={Icons.addNew}
                          width={40}
                          height={40}
                          alt="Add New"
                        />
                      </div>
                      <span className="text-body-medium font-medium text-primary">
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

                  {/* Tooltip */}
                  {!org?.isAddNew && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block">
                      <div className="relative bg-white border border-gray-200 shadow-md rounded px-2 py-0.5 text-body-tiny text-gray-800 whitespace-nowrap">
                        {org?.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-l border-t border-gray-200 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}</>}
        </div>

        {/* View More */}
        <div className="mt-4 flex justify-end">
          <button className="text-[#795CF5] text-body-medium font-medium hover:underline cursor-pointer">
            View More
          </button>
        </div>
      </div>
      {selectedOrg && (
        <DeleteOrganizationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          organizationName={selectedOrg.name}
          extraDetails={`${selectedOrg.memberships?.length || 0} member${selectedOrg?.memberships?.length === 1 ? "" : "s"} • ${selectedOrg.products?.length || 0} product${selectedOrg.products?.length === 1 ? "" : "s"}`}
          isDeleting={deleteLoading}
        />
      )}
    </>
  );
}

