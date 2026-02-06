import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";

interface OrganizationMemberLinkProps {
  id: string;
  org: OgOrganization;
}

const OrganizationMemberLink = ({ id, org }: OrganizationMemberLinkProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    if (!org?.created_at) return false;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;

    const diffMs = Date.now() - createdAt.getTime();
    const ONE_MINUTE_MS = 60 * 1000;

    return diffMs < ONE_MINUTE_MS;
  });

  useEffect(() => {
    if (!org?.created_at) return;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;

    const ONE_MINUTE_MS = 60 * 1000;

    const updateDisabledState = () => {
      const diffMs = Date.now() - createdAt.getTime();
      if (diffMs < ONE_MINUTE_MS) {
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
    <div
      className={`flex items-center -space-x-0.5 ${
        isDisabled ? "" : "bg-primary/10"
      } `}
    >
      {org?.products?.map((product, index) => (
        <Link
          key={index}
          href={generateProductLink(org?.products?.[index]?.oi_sub_domain!)}
          target="_blank"
          className={`relative z-30 group/member duration-300 transition-all ${
            isDisabled ? "cursor-not-allowed" : "hover:scale-110"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isDisabled) {
              e.preventDefault();
            }
          }}
        >
          <span className={isDisabled ? "opacity-50" : ""}>
            <SvgIcon
              name={product.product_name as IconName}
              width={20}
              height={20}
            />
          </span>

          {isDisabled && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/member:block">
              <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
                Processing...
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default OrganizationMemberLink;
