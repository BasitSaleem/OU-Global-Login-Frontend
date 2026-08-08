import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { User } from "@/types/auth.types";
import { getColorFromId } from "@/utils/getRandomColors";
import { PackagePlus, Trash, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button, Tooltip } from "@/components/ui";
import { useRouter } from "next/navigation";
import { organizationName } from "@/utils/organizationName";
import OILink from "./OrganizationMemberLink";
import { SUBSCRIPTION_STATUS_COLOR } from "@/utils/ColorClasses";
import { useGhlLocation } from "@/apiHooks.ts/ghl/ghl.api";

interface OrganizationGridComponentProps {
  id: string;
  org: OgOrganization;
  isPending: boolean;
  handleFavoriteClick: (e: React.MouseEvent, orgId: string) => void;
  user: User | null;
  handleDeleteClick: (org: any) => void;
  onAddProduct?: (org: OgOrganization) => void;
}

const ADDABLE_PRODUCTS = ["OI", "OP"];

export function OrganizationGridComponent({
  id,
  org,
  isPending,
  handleFavoriteClick,
  user,
  handleDeleteClick,
  onAddProduct,
}: OrganizationGridComponentProps) {
  const isFavorite = useMemo(() => {
    return org?.favorites?.some((fUser) => fUser.userId === user?.id) ?? false;
  }, [org?.favorites, user?.id]);
  const bgColor = useMemo(() => getColorFromId(org.id), [org.id]);

  // Owner-only "add product" affordance, shown when the org is missing an
  // addable product. Mirrors the backend's creator-or-OWNER check.
  const canAddProduct = useMemo(() => {
    if (!onAddProduct) return false;
    const existing = new Set((org.products ?? []).map((p) => p.product_name));
    const missing = ADDABLE_PRODUCTS.filter((c) => !existing.has(c));
    const isOwner =
      org.ogUserId === user?.id ||
      !!org.memberships?.some((m) => m.role === "OWNER");
    return missing.length > 0 && isOwner;
  }, [org, user?.id, onAddProduct]);

  // Owners Pulse members live in GHL, not our DB — fetch its live contact
  // count only when the org actually has an OP product, then fold it into
  // the OI membership count for a single combined total on the card.
  const hasOpProduct = useMemo(
    () => (org.products ?? []).some((p) => p.product_name === "OP"),
    [org.products],
  );
  const { data: ghlLocation } = useGhlLocation(org.id, hasOpProduct);
  const totalMembers =
    (org?._count?.memberships ?? 0) + (ghlLocation?.membersCount ?? 0);

  const router = useRouter();
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/organization-details/${org.id}/billing`);
  };

  return (
    <div key={id} className="flex flex-col h-25" onClick={onClick}>
      <div className="flex items-start gap-3 mb-2">
        <Tooltip content={org?.name || ""} position="top">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: bgColor }}
          >
            {org?.name ? `${organizationName(org.name)}` : ""}
          </div>
        </Tooltip>
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-body-medium-bold text-black leading-tight pt-1">
            {org?.name}
          </h3>
          <div className="flex items-center gap-2 overflow-hidden">
            <p className="text-body-tiny text-gray-500 truncate">
              {org?.subscriptions?.[0]?.oiPackage?.package_name || "Basic"}
            </p>
            {org?.subscriptions?.[0]?.status && (
              <span
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full uppercase whitespace-nowrap ${
                  SUBSCRIPTION_STATUS_COLOR[org.subscriptions[0].status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {org.subscriptions[0].status}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex ">
          {canAddProduct && (
            <Tooltip content="Add owner pulse product" position="top">
              <Button
                variant="basic"
                className="z-40 hover:scale-110 duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddProduct!(org);
                }}
                aria-label="Add a product"
              >
                <PackagePlus size={20} className="text-primary" />
              </Button>
            </Tooltip>
          )}
          <Tooltip
            content={isFavorite ? "Unfavorite" : "Make favorite"}
            position="top"
          >
            <Button
              variant="basic"
              permission={"og:favorite::organization"}
              className={`relative z-40 transition-all duration-300 group ${
                isPending ? "cursor-not-allowed scale-95" : "hover:scale-110"
              }`}
              disabled={isPending}
              onClick={(e) => {
                handleFavoriteClick(e, org.id);
              }}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill={isFavorite ? "#795CF5" : "none"}
                stroke="#795CF5"
                strokeWidth="1.5"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-200 ${
                  isPending
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100 group-hover:scale-105"
                }`}
              >
                <path d="M9.04907 2.92705C9.34843 2.00574 10.6518 2.00574 10.9511 2.92705L12.0207 6.21885C12.1546 6.63087 12.5386 6.90983 12.9718 6.90983H16.433C17.4017 6.90983 17.8045 8.14945 17.0208 8.71885L14.2206 10.7533C13.8701 11.0079 13.7235 11.4593 13.8573 11.8713L14.9269 15.1631C15.2263 16.0844 14.1718 16.8506 13.3881 16.2812L10.5879 14.2467C10.2374 13.9921 9.76279 13.9921 9.4123 14.2467L6.61213 16.2812C5.82842 16.8506 4.77394 16.0844 5.07329 15.1631L6.14286 11.8713C6.27673 11.4593 6.13007 11.0079 5.77958 10.7533L2.97941 8.71885C2.19569 8.14945 2.59847 6.90983 3.56719 6.90983H7.02839C7.46161 6.90983 7.84557 6.63087 7.97944 6.21885L9.04907 2.92705Z" />
              </svg>
            </Button>
          </Tooltip>
          {org.permissionNames?.includes("og:delete::organization") &&
            org.memberships?.some(
              (membership) => membership.role === "OWNER",
            ) && (
              <Tooltip content="Delete" position="top">
                <Button
                  variant="basic"
                  className="z-40 hover:scale-110 duration-300"
                  disabled={isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(org);
                  }}
                >
                  <Trash2 color="red" size={20} />
                </Button>
              </Tooltip>
            )}
        </div>
      </div>

      <div className={`mt-auto rounded-lg transition-all  bg-primary/10`}>
        <div className="flex items-center justify-between px-2 py-1 ">
          <span className="text-[14px] font-medium text-primary">
            {totalMembers} member{totalMembers === 1 ? "" : "s"}
          </span>
          <OILink org={org} subscription={org?.subscriptions?.[0]} />
        </div>
      </div>
    </div>
  );
}
