import React, { useEffect, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";

import {
  OgOrganization,
  OgProduct,
} from "@/apiHooks.ts/organization/organization.types";
import { organizationName } from "@/utils/organizationName";
import Link from "next/link";

interface OrganizationProductItemProps {
  product: OgProduct;
  bgColor: string;
  org: OgOrganization;
}

const OrganizationProductItem = ({
  product,
  bgColor,
  org,
}: OrganizationProductItemProps) => {
  // Track whether this product link should be disabled based on org creation time
  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    if (!org?.created_at) return false;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;

    const diffMs = Date.now() - createdAt.getTime();
    const THIRTY_SECONDS_MS = 20 * 1000;

    return diffMs < THIRTY_SECONDS_MS;
  });

  // Auto-enable after 1 minute without needing a page refresh
  useEffect(() => {
    if (!org?.created_at) return;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;

    const THIRTY_SECONDS_MS = 30 * 1000;

    const updateDisabledState = () => {
      const diffMs = Date.now() - createdAt.getTime();
      if (diffMs >= THIRTY_SECONDS_MS) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };

    // Run immediately on mount/update
    updateDisabledState();

    const intervalId = setInterval(updateDisabledState, 1000);

    return () => clearInterval(intervalId);
  }, [org?.created_at]);

  return (
    <Link
      key={product.oi_sub_domain}
      href={generateProductLink(product.oi_sub_domain ?? "")}
      target="_blank"
      className={`relative group/product duration-300 transition-all ${isDisabled ? "cursor-not-allowed" : ""
        }`}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 ${isDisabled
          ? "opacity-50 cursor-not-allowed hover:scale-100"
          : "cursor-pointer hover:scale-110"
          }`}
        style={{ backgroundColor: bgColor }}
        title={org.name}
      >
        {organizationName(org.name ?? "")}
      </div>

      {isDisabled && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/product:block">
          <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
            Processing...
          </div>
        </div>
      )}
    </Link>
  );
};

export default OrganizationProductItem;
