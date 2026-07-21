import {
  OgOrganization,
  OgProduct,
  Subscription,
} from "@/apiHooks.ts/organization/organization.types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";
import { useGhlSso } from "@/apiHooks.ts/ghl/ghl.api";

interface OILinkProps {
  org: OgOrganization;
  subscription?: Subscription;
}

// One launch icon per product on the org card. Owners Pulse launches via
// RP-initiated SSO (POST /og/ghl/sso -> { redirectUrl } -> the GHL white-label
// login) — NOT an OI subdomain URL (which for OP produced "null.localhost:8001").
// OI (and any subdomain product) keeps opening its subdomain login.
const ProductLaunchIcon = ({
  product,
  org,
  oiDisabled,
  oiStatusDisabled,
}: {
  product: OgProduct;
  org: OgOrganization;
  oiDisabled: boolean;
  oiStatusDisabled: boolean;
}) => {
  const { mutate: openSso, isPending } = useGhlSso();
  const icon = (
    <SvgIcon name={product.product_name as IconName} width={24} height={24} />
  );

  if (product.product_name === "OP") {
    const ready =
      (product.provisioning_status || "").toUpperCase() === "PROVISIONED";
    const disabled = !ready || isPending;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled || !org.id) return;
          // Open the tab synchronously on the click (so it isn't popup-blocked),
          // then point it at the SSO URL once the backend returns it. GHL SSO
          // opens in a NEW tab, leaving the Global Portal in place.
          const ssoTab = window.open("", "_blank");
          if (ssoTab) ssoTab.opener = null;
          openSso(
            { orgId: org.id },
            {
              onSuccess: (d) => {
                if (d?.redirectUrl) {
                  if (ssoTab) ssoTab.location.href = d.redirectUrl;
                  else window.open(d.redirectUrl, "_blank");
                } else {
                  ssoTab?.close();
                }
              },
              onError: () => ssoTab?.close(),
            },
          );
        }}
        className={`relative z-30 group/member duration-300 transition-all ${
          disabled ? "cursor-not-allowed" : "hover:scale-110"
        }`}
      >
        <span className={disabled ? "opacity-50" : ""}>{icon}</span>
        {disabled && (
          <div className="absolute bottom-full left-1/3 -translate-x-1/2 mb-1 hidden group-hover/member:block">
            <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
              {isPending ? "Opening..." : "Processing..."}
            </div>
          </div>
        )}
      </button>
    );
  }

  return (
    <Link
      href={generateProductLink(product.oi_sub_domain ?? "")}
      target="_blank"
      className={`relative z-30 group/member duration-300 transition-all ${
        oiDisabled ? "cursor-not-allowed" : "hover:scale-110"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (oiDisabled) e.preventDefault();
      }}
    >
      <span className={oiDisabled ? "opacity-50" : ""}>{icon}</span>
      {oiDisabled && (
        <div className="absolute bottom-full left-1/3 -translate-x-1/2 mb-1 hidden group-hover/member:block">
          <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white bg-primary shadow-lg whitespace-nowrap">
            {oiStatusDisabled ? "Upgrade Subscription" : "Processing..."}
          </div>
        </div>
      )}
    </Link>
  );
};

const OILink = ({ org, subscription }: OILinkProps) => {
  const isStatusDisabled = Boolean(
    subscription?.status &&
      ["PAST_DUE", "CANCELLED", "EXPIRED", "INCOMPLETE"].includes(
        subscription.status,
      ),
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    if (isStatusDisabled) return true;
    if (!org?.created_at) return false;
    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;
    const diffMs = Date.now() - createdAt.getTime();
    return diffMs < 30 * 1000;
  });

  useEffect(() => {
    if (!org?.created_at) return;
    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;
    const THIRTY_SECOND_MS = 30 * 1000;
    const update = () => {
      if (isStatusDisabled) {
        setIsDisabled(true);
        return;
      }
      setIsDisabled(Date.now() - createdAt.getTime() < THIRTY_SECOND_MS);
    };
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [org?.created_at]);

  const oiDisabled = Boolean(isDisabled || isStatusDisabled);

  return (
    <div className="flex items-center -space-x-0.5">
      {org?.products?.map((product, index) => (
        <ProductLaunchIcon
          key={index}
          product={product}
          org={org}
          oiDisabled={oiDisabled}
          oiStatusDisabled={isStatusDisabled}
        />
      ))}
    </div>
  );
};

export default OILink;
