"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_OI_PLAN_ID = "d755fe7d-4372-426c-af33-e63b71a6521f";

const PRESERVE_KEYS = [
  "pkgId",
  "product",
  "billingCycle",
  "op_pkgId",
  "op_billingCycle",
] as const;

export function clearIncomingPackageSelection() {
  PRESERVE_KEYS.forEach((key) => localStorage.removeItem(key));
}

// Resolves an incoming OI/OP package selection from the URL (a landing-page
// link) or, failing that, localStorage (a selection persisted across a
// login/signup detour) — and persists any query values it sees so they
// survive that detour. Shared by /create-organization and /organizations so
// both the first-org wizard and the "Add Organization" modal can pre-fill the
// same selection.
export function useIncomingPackageSelection() {
  const searchParams = useSearchParams();
  const queryPkgId = searchParams.get("pkgId");
  const queryProduct = searchParams.get("product");
  const queryBillingCycle = searchParams.get("billingCycle");
  const queryOpPkgId = searchParams.get("op_pkgId");
  const queryOpBillingCycle = searchParams.get("op_billingCycle");

  const pkgId =
    queryPkgId ||
    (typeof window !== "undefined" ? localStorage.getItem("pkgId") : null) ||
    DEFAULT_OI_PLAN_ID;

  const product =
    queryProduct ||
    (typeof window !== "undefined" ? localStorage.getItem("product") : null) ||
    "OI";

  const billingCycle =
    queryBillingCycle ||
    (typeof window !== "undefined"
      ? localStorage.getItem("billingCycle")
      : null) ||
    "monthly";

  const opPkgId =
    queryOpPkgId ||
    (typeof window !== "undefined" ? localStorage.getItem("op_pkgId") : null) ||
    null;

  const opBillingCycle =
    queryOpBillingCycle ||
    (typeof window !== "undefined"
      ? localStorage.getItem("op_billingCycle")
      : null) ||
    "monthly";

  useEffect(() => {
    if (queryPkgId) {
      localStorage.setItem("pkgId", queryPkgId);
    }
    if (queryProduct) {
      localStorage.setItem("product", queryProduct);
    }
    if (queryBillingCycle) {
      localStorage.setItem("billingCycle", queryBillingCycle);
    }
    if (queryOpPkgId) {
      localStorage.setItem("op_pkgId", queryOpPkgId);
    }
    if (queryOpBillingCycle) {
      localStorage.setItem("op_billingCycle", queryOpBillingCycle);
    }
  }, [
    queryPkgId,
    queryProduct,
    queryBillingCycle,
    queryOpPkgId,
    queryOpBillingCycle,
  ]);

  const hasDirectLink = !!queryPkgId || !!queryOpPkgId;

  return {
    pkgId,
    product,
    billingCycle: billingCycle as "monthly" | "yearly",
    opPkgId,
    opBillingCycle: opBillingCycle as "monthly" | "yearly",
    queryPkgId,
    queryOpPkgId,
    hasDirectLink,
  };
}
