"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useGetMe } from "@/apiHooks.ts/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { clearAuth, setOrganization } from "@/redux/slices/auth.slice";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  // Where to send an authenticated user who already owns an organization,
  // instead of rendering `children`. Used by the first-org wizard to bounce
  // existing-org users arriving via a package link over to /organizations.
  existingOrgRedirectTo?: string;
}

export function AuthGuard({
  children,
  fallback,
  redirectTo,
  existingOrgRedirectTo,
}: AuthGuardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasRedirected = useRef(false);
  const hasRedirectedForExistingOrg = useRef(false);

  const { data, isLoading, isError } = useGetMe();

  const organization = data?.data?.user
    ? data.data.user.organizations?.[0] ??
      data.data.user.memberships?.[0]?.organization ??
      undefined
    : undefined;

  useEffect(() => {
    if (!isLoading && organization) {
      dispatch(setOrganization(organization));
    }
  }, [organization, isLoading, dispatch]);

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      organization &&
      existingOrgRedirectTo &&
      !hasRedirectedForExistingOrg.current
    ) {
      hasRedirectedForExistingOrg.current = true;
      router.replace(existingOrgRedirectTo);
    }
  }, [isLoading, isError, organization, existingOrgRedirectTo, router]);

  useEffect(() => {
    if (!isLoading && isError && !hasRedirected.current) {
      hasRedirected.current = true;
      dispatch(clearAuth());
      queryClient.clear();
      // Preserve the OI/OP package selection across the auth redirect
      const preserveKeys = [
        "pkgId",
        "product",
        "billingCycle",
        "op_pkgId",
        "op_billingCycle",
      ];
      const saved = Object.fromEntries(
        preserveKeys.map((key) => [key, localStorage.getItem(key)]),
      );
      localStorage.clear();
      preserveKeys.forEach((key) => {
        if (saved[key]) {
          localStorage.setItem(key, saved[key]);
        }
      });
      sessionStorage.clear();
      router.replace(redirectTo || ROUTES.LOGIN);
    }
  }, [isLoading, isError, router, dispatch, queryClient, redirectTo]);

  if (isLoading) {
    return fallback || null;
  }

  if (isError) {
    return fallback || null;
  }

  if (organization && existingOrgRedirectTo) {
    return fallback || null;
  }

  return <>{children}</>;
}
