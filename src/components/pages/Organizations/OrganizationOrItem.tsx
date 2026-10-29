"use client";

import {
  OgOrganization,
  OgProduct,
} from "@/apiHooks.ts/organization/organization.types";
import { organizationName } from "@/utils/organizationName";
import { OR_PRODUCT_URL } from "@/config/or.config";

interface OrganizationOrItemProps {
  product: OgProduct;
  org: OgOrganization;
  bgColor: string;
}

export function generateOrSsoUrl(orgId: string, productId: string): string {
  return `${OR_PRODUCT_URL}/api/auth/sso/start?org_id=${encodeURIComponent(orgId)}&product_id=${encodeURIComponent(productId)}`;
}

const OrganizationOrItem = ({
  product,
  org,
  bgColor,
}: OrganizationOrItemProps) => {
  const status = (product.provisioning_status || "PENDING").toUpperCase();
  const isReady = status === "PROVISIONED";
  const isFailed = status === "FAILED";
  const isDisabled = !isReady;

  const handleClick = () => {
    if (isDisabled || !org.id || !product.id) return;
    window.open(
      generateOrSsoUrl(org.id, product.id),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="relative group/product">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 ${
          isDisabled
            ? "opacity-50 cursor-not-allowed hover:scale-100"
            : "cursor-pointer hover:cursor-pointer hover:scale-110"
        }`}
        style={{ backgroundColor: bgColor }}
        title={isReady ? (org.name ?? "Open Owners Reach") : ""}
      >
        {organizationName(org.name ?? "")}
      </button>

      {isDisabled && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/product:block">
          <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
            {isFailed ? "Provisioning failed" : "Processing..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationOrItem;
