"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import { useCheckoutStatus } from "@/apiHooks.ts/billing/billingGateway.api";
import { formatMinor } from "@/utils/money";

// Landing page after the customer returns from a redirect gateway (PayFast).
// Display only: access is granted by the backend once the payment is verified
// server-to-server; this page just polls until that has happened.

const MAX_WAIT_MS = 3 * 60 * 1000;

function PaymentReturnContent() {
  const { orgId } = useParams<{ orgId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const checkoutId = searchParams.get("checkout");
  const returnedWithFailure = searchParams.get("result") === "failure";

  const { data, error, refetch } = useCheckoutStatus(checkoutId);
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWaitedTooLong(true), MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data?.status === "PAID") {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["billing-options", orgId] });
    }
  }, [data?.status, orgId, queryClient]);

  const goToBilling = () => router.push(`/organization-details/${orgId}/billing`);
  const amount = data?.amountMinor != null ? formatMinor(data.amountMinor, data.currency) : null;
  const status = data?.status;

  let icon = <Loader2 className="w-12 h-12 text-primary animate-spin" />;
  let title = "Confirming your payment...";
  let body = "This usually takes a few seconds. You can leave this page; we will email you once it is confirmed.";
  let actions = null as React.ReactNode;

  if (!checkoutId || error) {
    icon = <XCircle className="w-12 h-12 text-red-500" />;
    title = "Payment not found";
    body = "We could not find this payment. If you were charged, it will appear on your billing page shortly.";
    actions = <PrimaryButton onClick={goToBilling}>Go to Billing</PrimaryButton>;
  } else if (status === "PAID") {
    icon = <CheckCircle2 className="w-12 h-12 text-green-500" />;
    title = "Payment successful";
    body = `${amount ? `${amount} received. ` : ""}${data?.packageName ? `${data.packageName} is now active.` : "Your plan is active."}`;
    actions = <PrimaryButton onClick={goToBilling}>Go to Billing</PrimaryButton>;
  } else if (status === "NEEDS_REVIEW") {
    icon = <Clock className="w-12 h-12 text-amber-500" />;
    title = "We are verifying your payment";
    body =
      data?.failureMessage ||
      "Your payment needs a quick manual check. Our team will confirm it shortly, no need to pay again.";
    actions = <PrimaryButton onClick={goToBilling}>Go to Billing</PrimaryButton>;
  } else if (status === "FAILED" || status === "EXPIRED" || status === "CANCELLED") {
    icon = <XCircle className="w-12 h-12 text-red-500" />;
    title = "Payment not completed";
    body = data?.failureMessage || "The payment was not completed. You have not been charged.";
    actions = <PrimaryButton onClick={goToBilling}>Try again</PrimaryButton>;
  } else if (waitedTooLong) {
    icon = <Clock className="w-12 h-12 text-amber-500" />;
    title = "Still confirming";
    body = returnedWithFailure
      ? "It looks like the payment was not completed. If money was deducted, it will be confirmed automatically within a few minutes."
      : "PayFast has not confirmed the payment yet. It will be confirmed automatically within a few minutes; we will email you.";
    actions = (
      <div className="flex gap-3 justify-center">
        <SecondaryButton
          onClick={() => {
            setWaitedTooLong(false);
            refetch();
          }}
        >
          Check again
        </SecondaryButton>
        <PrimaryButton onClick={goToBilling}>Go to Billing</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-20 px-4">
      <div className="bg-bg-secondary border rounded-2xl p-10 flex flex-col items-center text-center gap-4">
        {icon}
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-text">{body}</p>
        {actions && <div className="mt-4 w-full">{actions}</div>}
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer hover:opacity-90"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2.5 rounded-xl border font-semibold text-sm cursor-pointer hover:bg-background"
    >
      {children}
    </button>
  );
}

export default function PaymentReturnPage() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <PaymentReturnContent />
      </Suspense>
    </AuthGuard>
  );
}
