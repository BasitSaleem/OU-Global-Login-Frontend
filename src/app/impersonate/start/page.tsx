"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useImpersonateLogin } from "@/apiHooks.ts/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { Loader } from "@/components/ui";

export default function ImpersonateStart() {
  const router = useRouter();
  const { mutate: impersonateLogin } = useImpersonateLogin();
  const dispatch = useAppDispatch();
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    hasAttempted.current = true;

    impersonateLogin({ token });
  }, [dispatch, impersonateLogin, router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Loader text="Starting Impersonation Session..." />
    </main>
  );
}
