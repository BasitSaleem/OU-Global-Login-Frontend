"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CalendarClock, Loader2, Wallet } from "lucide-react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import {
  useBillingOptions,
  useCancelPlatformSubscription,
  useResumePlatformSubscription,
  useStartRenewal,
} from "@/apiHooks.ts/billing/billingGateway.api";
import { isValidPkMobile } from "@/components/pages/Checkout/PayFastPanel";
import { runCheckoutAction } from "@/utils/checkoutAction";
import { formatMajor } from "@/utils/money";
import { formatDate } from "@/utils/helpers";

// Billing panel for subscriptions run by our own billing engine (PayFast).
// There is no saved card: each period is paid through a "Pay now" link, with
// a grace period after the period ends.

interface Props {
  orgId: string;
  organization: OgOrganization;
}

const PlatformBillingSection = ({ orgId, organization }: Props) => {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("renew") === "1";
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: options, isLoading } = useBillingOptions(orgId);
  const startRenewal = useStartRenewal(orgId);
  const cancel = useCancelPlatformSubscription(orgId);
  const resume = useResumePlatformSubscription(orgId);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (highlight) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [highlight]);

  const sub = organization.subscriptions?.[0];
  const renewal = options?.renewal;
  const needsPhone = !options?.savedPhone;
  const displayName = options?.displayName ?? "PayFast";

  if (isLoading || !sub) {
    return (
      <div className="w-full border rounded-lg p-6 mt-8 flex items-center gap-2 text-sm text-text">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading billing...
      </div>
    );
  }

  const status = renewal?.status ?? sub.status;
  const periodEnd = renewal?.currentPeriodEnd ?? sub.current_period_end;

  const payNow = async () => {
    if (needsPhone && !isValidPkMobile(phone)) {
      setPhoneError("Enter a valid Pakistani mobile number, e.g. 03001234567");
      return;
    }
    setPhoneError(null);
    const result = await startRenewal.mutateAsync({ phone: needsPhone ? phone : null });
    await runCheckoutAction(result.action);
  };

  return (
    <div
      ref={sectionRef}
      className={`w-full mt-8 scroll-mt-24 transition-shadow ${highlight ? "ring-2 ring-primary rounded-lg" : ""}`}
    >
      <h2 className="text-heading-1 font-bold pb-2">Billing</h2>

      {status === "PAST_DUE" && (
        <Banner tone="danger">
          Your renewal payment is overdue. You keep access until{" "}
          <strong>{renewal?.graceEndsAt ? formatDate(renewal.graceEndsAt) : "the end of the grace period"}</strong>.
          Pay now to avoid interruption.
        </Banner>
      )}
      {status === "EXPIRED" && (
        <Banner tone="danger">Your plan has expired because the renewal was not paid. Pay now to restore access.</Banner>
      )}
      {sub.cancel_at_period_end && status !== "EXPIRED" && (
        <Banner tone="warning">
          Your plan is set to end on <strong>{periodEnd ? formatDate(periodEnd) : "the end of the period"}</strong>.
        </Banner>
      )}

      <div className="border rounded-lg w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-5 px-4 md:px-9">
        <Info label="Your Plan" value={sub.oiPackage?.package_name ?? "--"} />
        <Info
          label="Amount"
          value={
            sub.total_amount != null
              ? `${formatMajor(sub.total_amount, sub.currency)} / ${sub.billing_cycle === "YEARLY" ? "year" : "month"}`
              : "--"
          }
        />
        <Info label={status === "EXPIRED" ? "Expired on" : "Paid until"} value={periodEnd ? formatDate(periodEnd) : "--"} />
        <Info label="Payment method" value={`${displayName} (pay each period)`} />
      </div>

      <div className="border rounded-lg w-full mt-4 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            {renewal?.canPayNow ? <Wallet className="w-5 h-5 text-primary" /> : <CalendarClock className="w-5 h-5 text-primary" />}
          </div>
          <div className="text-sm">
            {renewal?.canPayNow ? (
              <>
                <p className="font-semibold">Renewal is due</p>
                <p className="text-text">
                  Pay through {displayName} with a card, JazzCash, Easypaisa or bank account.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">No payment due</p>
                <p className="text-text">
                  {renewal?.opensAt && !sub.cancel_at_period_end
                    ? `You can pay the next renewal from ${formatDate(renewal.opensAt)}. We will remind you by email.`
                    : "Renewals are not charged automatically."}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-2 min-w-[240px]">
          {renewal?.canPayNow && needsPhone && (
            <>
              <input
                className="border rounded-lg px-3 py-2 text-sm bg-background"
                placeholder="Mobile number (03XX XXXXXXX)"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError(null);
                }}
              />
              {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
            </>
          )}
          {renewal?.canPayNow && (
            <button
              type="button"
              onClick={payNow}
              disabled={startRenewal.isPending}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {startRenewal.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Pay now with {displayName}
            </button>
          )}
          {(status === "ACTIVE" || status === "PAST_DUE") &&
            (sub.cancel_at_period_end ? (
              <button
                type="button"
                onClick={() => resume.mutate()}
                disabled={resume.isPending}
                className="px-5 py-2 rounded-xl border font-semibold text-sm cursor-pointer disabled:opacity-50"
              >
                Keep my plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Cancel your plan at the end of the paid period?")) cancel.mutate(undefined);
                }}
                disabled={cancel.isPending}
                className="text-xs text-red-500 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel plan at period end
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <h3 className="text-text font-bold mb-1">{label}</h3>
      <p className="text-body-small">{value}</p>
    </div>
  );
}

function Banner({ tone, children }: { tone: "danger" | "warning"; children: React.ReactNode }) {
  const styles =
    tone === "danger" ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-800";
  return (
    <div className={`flex items-start gap-2 border rounded-lg px-4 py-3 mb-4 text-sm ${styles}`}>
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default PlatformBillingSection;
