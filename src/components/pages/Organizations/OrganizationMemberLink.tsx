import {
  OgOrganization,
  OgProduct,
  Subscription,
} from "@/apiHooks.ts/organization/organization.types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generateProductLink } from "./OrganizationProductCard";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";
import { Tooltip } from "@/components/ui";
import { PRODUCTS } from "@/constants";
import { useGhlSso } from "@/apiHooks.ts/ghl/ghl.api";
import { generateOrSsoUrl } from "./OrganizationOrItem";

interface OILinkProps {
  org: OgOrganization;
  subscription?: Subscription;
}

// The product logos sit on differently shaped canvases (OP is wide: a circle
// plus a pulse line), so one square box drew OP's circle smaller than the
// others. These boxes give every logo's circle the same 18px diameter.
const LAUNCH_ICON_SIZE: Record<string, { width: number; height: number }> = {
  OI: { width: 25, height: 20 },
  OP: { width: 28, height: 18 },
  OR: { width: 24, height: 21 },
};
const DEFAULT_LAUNCH_ICON_SIZE = { width: 24, height: 24 };

const LAUNCH_ICON_CLASS = "relative z-30 flex";

// Hover names the product; a product that cannot open yet also says why.
// Disabled icons use aria-disabled (not disabled) so the tooltip still shows.
const LaunchTooltip = ({
  name,
  note,
  children,
}: {
  name: string;
  note?: string;
  children: React.ReactNode;
}) => (
  <Tooltip
    content={note ? `${name} · ${note}` : name}
    position="top"
    className="rounded-md px-2 py-1 text-[11px]! leading-4 shadow-md"
  >
    {children}
  </Tooltip>
);

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
  const size =
    LAUNCH_ICON_SIZE[product.product_name ?? ""] ?? DEFAULT_LAUNCH_ICON_SIZE;
  const name =
    PRODUCTS.find((p) => p.name === product.product_name)?.fullname ??
    product.product_name ??
    "";
  const icon = (
    <SvgIcon
      name={product.product_name as IconName}
      width={size.width}
      height={size.height}
    />
  );

  if (product.product_name === "OP") {
    const ready =
      (product.provisioning_status || "").toUpperCase() === "PROVISIONED";
    const disabled = !ready || isPending;
    return (
      <LaunchTooltip
        name={name}
        note={disabled ? (isPending ? "Opening..." : "Processing...") : undefined}
      >
        <button
          type="button"
          aria-label={`Open ${name}`}
          aria-disabled={disabled}
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
          className={`${LAUNCH_ICON_CLASS} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className={`flex ${disabled ? "opacity-50" : ""}`}>{icon}</span>
        </button>
      </LaunchTooltip>
    );
  }

  if (product.product_name === "OR") {
    const ready =
      (product.provisioning_status || "").toUpperCase() === "PROVISIONED";
    const disabled = !ready;
    return (
      <LaunchTooltip name={name} note={disabled ? "Processing..." : undefined}>
        <button
          type="button"
          aria-label={`Open ${name}`}
          aria-disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled || !org.id || !product.id) return;
            window.open(
              generateOrSsoUrl(org.id, product.id),
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className={`${LAUNCH_ICON_CLASS} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className={`flex ${disabled ? "opacity-50" : ""}`}>{icon}</span>
        </button>
      </LaunchTooltip>
    );
  }

  return (
    <LaunchTooltip
      name={name}
      note={
        oiDisabled
          ? oiStatusDisabled
            ? "Upgrade subscription"
            : "Processing..."
          : undefined
      }
    >
      <Link
        href={generateProductLink(product.oi_sub_domain ?? "")}
        target="_blank"
        aria-label={`Open ${name}`}
        aria-disabled={oiDisabled}
        className={`${LAUNCH_ICON_CLASS} ${
          oiDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (oiDisabled) e.preventDefault();
        }}
      >
        <span className={`flex ${oiDisabled ? "opacity-50" : ""}`}>{icon}</span>
      </Link>
    </LaunchTooltip>
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
    <div className="flex items-center gap-1.5">
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
