import {
  OgOrganization,
  Subscription,
} from "@/apiHooks.ts/organization/organization.types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";

interface OILinkProps {
  org: OgOrganization;
  subscription?: Subscription;
}

const OILink = ({ org, subscription }: OILinkProps) => {
  const isStatusDisabled =
    subscription?.status &&
    ["PAST_DUE", "CANCELLED", "EXPIRED", "INCOMPLETE"].includes(
      subscription.status,
    );

  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    if (isStatusDisabled) return true;
    if (!org?.created_at) return false;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;

    const diffMs = Date.now() - createdAt.getTime();
    const THIRTY_SECOND_MS = 30 * 1000;

    return diffMs < THIRTY_SECOND_MS;
  });

  useEffect(() => {
    if (!org?.created_at) return;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;

    const THIRTY_SECOND_MS = 30 * 1000;

    const updateDisabledState = () => {
      if (isStatusDisabled) {
        setIsDisabled(true);
        return;
      }
      const diffMs = Date.now() - createdAt.getTime();
      if (diffMs < THIRTY_SECOND_MS) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    };

    updateDisabledState();

    const intervalId = setInterval(updateDisabledState, 1000);

    return () => clearInterval(intervalId);
  }, [org?.created_at]);

  return (
    <div className="flex items-center -space-x-0.5">
      {org?.products?.map((product, index) => (
        <Link
          key={index}
          href={generateProductLink(org?.products?.[index]?.oi_sub_domain!)}
          target="_blank"
          className={`relative z-30 group/member duration-300 transition-all ${
            isDisabled || isStatusDisabled
              ? "cursor-not-allowed"
              : "hover:scale-110"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isDisabled || isStatusDisabled) {
              e.preventDefault();
            }
          }}
        >
          <span className={isDisabled || isStatusDisabled ? "opacity-50" : ""}>
            <SvgIcon
              name={product.product_name as IconName}
              width={24}
              height={24}
            />
          </span>

          {(isDisabled || isStatusDisabled) && (
            <div className="absolute bottom-full left-1/3 -translate-x-1/2 mb-1 hidden group-hover/member:block">
              <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
                {isStatusDisabled
                  ? `Upgrade Subscription` // ${subscription?.status}`
                  : "Processing..."}
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default OILink;
