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
  const subscriptionStatus = org?.subscriptions?.[0]?.status?.toUpperCase();
  const isSubscriptionDisabled =
    !!subscriptionStatus &&
    ["CANCELLED", "EXPIRED", "PAST_DUE"].includes(subscriptionStatus);

  const [isProcessing, setIsProcessing] = useState<boolean>(() => {
    if (!org?.created_at) return false;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;

    const diffMs = Date.now() - createdAt.getTime();
    const THIRTY_SECONDS_MS = 20 * 1000;

    return diffMs < THIRTY_SECONDS_MS;
  });

  useEffect(() => {
    if (!org?.created_at) return;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;

    const THIRTY_SECONDS_MS = 30 * 1000;

    const updateDisabledState = () => {
      const diffMs = Date.now() - createdAt.getTime();
      if (diffMs >= THIRTY_SECONDS_MS) {
        setIsProcessing(false);
      } else {
        setIsProcessing(true);
      }
    };

    updateDisabledState();

    const intervalId = setInterval(updateDisabledState, 1000);

    return () => clearInterval(intervalId);
  }, [org?.created_at]);

  const isDisabled = isProcessing || isSubscriptionDisabled;

  return (
    <Link
      key={product.oi_sub_domain}
      href={generateProductLink(product.oi_sub_domain ?? "")}
      target="_blank"
      className={`relative group/product duration-300 transition-all ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 ${
          isDisabled
            ? "opacity-50 cursor-not-allowed hover:scale-100"
            : "cursor-pointer hover:scale-110"
        }`}
        style={{ backgroundColor: bgColor }}
        title={isDisabled ? "" : org.name}
      >
        {organizationName(org.name ?? "")}
      </div>

      {isDisabled && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/product:block">
          <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
            {isSubscriptionDisabled ? "Upgrade Package" : "Processing..."}
          </div>
        </div>
      )}
    </Link>
  );
};

export default OrganizationProductItem;
