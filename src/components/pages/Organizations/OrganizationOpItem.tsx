"use client";

import {
  OgOrganization,
  OgProduct,
} from "@/apiHooks.ts/organization/organization.types";
import { organizationName } from "@/utils/organizationName";
import { useGhlSso } from "@/apiHooks.ts/ghl/ghl.api";
import { LoadingSpinner } from "@/components/ui";

interface OrganizationOpItemProps {
  product: OgProduct;
  org: OgOrganization;
  bgColor: string;
}

// Owners Pulse launch tile. Unlike OI (which links to a subdomain), OP launches
// via RP-initiated SSO: POST /og/ghl/sso -> { redirectUrl } -> redirect the
// browser to the GHL white-label login. Enabled only once the GHL sub-account
// has finished provisioning (ogProduct.provisioning_status === "PROVISIONED").
const OrganizationOpItem = ({
  product,
  org,
  bgColor,
}: OrganizationOpItemProps) => {
  const { mutate: openSso, isPending } = useGhlSso();

  const status = (product.provisioning_status || "PENDING").toUpperCase();
  const isReady = status === "PROVISIONED";
  const isFailed = status === "FAILED";
  const isDisabled = !isReady || isPending;

  const handleClick = () => {
    if (isDisabled || !org.id) return;
    openSso(
      { orgId: org.id },
      {
        onSuccess: (data) => {
          if (data?.redirectUrl)
            window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
        },
      },
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
            : "cursor-pointer hover:scale-110"
        }`}
        style={{ backgroundColor: bgColor }}
        title={isReady && !isPending ? (org.name ?? "Open Owners Pulse") : ""}
      >
        {isPending ? (
          <LoadingSpinner size={3} className="border-white" />
        ) : (
          organizationName(org.name ?? "")
        )}
      </button>

      {isDisabled && !isPending && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/product:block">
          <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
            {isFailed ? "Provisioning failed" : "Processing..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationOpItem;
