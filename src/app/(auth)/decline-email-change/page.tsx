"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui";
import { useDeclineChangeEmail } from "@/apiHooks.ts/auth/auth.api";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

const Page = () => {
  const router = useRouter();
  const {
    mutate: declineChangeEmail,
    isPending,
    status: mutationStatus,
    error,
  } = useDeclineChangeEmail();
  const searchParams = useSearchParams();
  const token = searchParams.get("change_email_token") || "";

  const handleDecline = () => {
    declineChangeEmail({ token });
  };

  if (!token) {
    return (
      <AuthPageShell>
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold text-lg">Invalid Session</p>
          <p className="text-gray-500 text-sm">
            Please restart the email change process from your settings.
          </p>
          <Button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            variant="primary"
            className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl"
          >
            Back to Login
          </Button>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <div className="text-center space-y-6">
        {(mutationStatus === "idle" || isPending) && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Decline Email Change
            </h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to decline the requested email change? Your
              current email will remain unchanged.
            </p>
            <Button
              onClick={handleDecline}
              isLoading={isPending}
              className="w-full h-12.5 rounded-xl bg-red-500 hover:bg-red-600 text-white cursor-pointer font-bold"
            >
              Confirm Decline
            </Button>
            <Button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              disabled={isPending}
              className="w-full h-12.5 rounded-xl border border-border text-text hover:bg-black/3 font-bold"
            >
              Cancel & Go to Login
            </Button>
          </>
        )}

        {mutationStatus === "success" && (
          <>
            <div className="text-green-500 text-5xl flex justify-center">✓</div>
            <p className="text-lg font-bold text-green-600">
              Successfully Declined
            </p>
            <Button
              onClick={() => router.push(ROUTES.LOGIN)}
              variant="primary"
              className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl"
            >
              Back to Login
            </Button>
          </>
        )}

        {mutationStatus === "error" && (
          <>
            <div className="text-red-500 text-5xl flex justify-center">✕</div>
            <p className="text-lg font-bold text-red-600">Decline Failed</p>
            <p className="text-sm text-center text-gray-500">
              {error?.message?.includes("No change email request found")
                ? "This decline link is invalid or has already been used. Redirecting to login..."
                : "We couldn't process your request. Please try again or contact support."}
            </p>
            <Button
              onClick={() => router.push(ROUTES.LOGIN)}
              variant="primary"
              className="w-full h-12.5 text-white text-sm bg-linear-to-r from-primary to-[#F95C5B] hover:opacity-90 border-none font-bold rounded-xl"
            >
              Back to Login
            </Button>
          </>
        )}
      </div>
    </AuthPageShell>
  );
};

export default Page;
