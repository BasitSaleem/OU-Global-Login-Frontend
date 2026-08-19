"use client";
import { useGhlSso, useGhlLocation, useRetryProvisioning } from "@/apiHooks.ts/ghl/ghl.api";

// Owners Pulse billing lives entirely in GHL — the portal doesn't display OP
// billing details. Instead it links the user into their Owners Pulse (GHL)
// account. The "Visit Owners Pulse" link triggers RP-initiated SSO via
// /og/ghl/sso and will redirect properly once the white-label SSO is live.
const OpBillingSection = ({
  orgId,
  title = "Owners Pulse Billing",
  message = "To see billing details, please navigate to your Owners Pulse account.",
}: {
  orgId: string;
  title?: string;
  message?: string;
}) => {
  const { mutate: openSso, isPending } = useGhlSso();
  const { data: ghlLocation } = useGhlLocation(orgId);
  const { mutate: retry, isPending: isRetrying } = useRetryProvisioning(orgId);

  const handleVisit = () => {
    if (!orgId) return;
    openSso(
      { orgId },
      {
        onSuccess: (data) => {
          if (data?.redirectUrl) window.open(data.redirectUrl, "_blank");
        },
      },
    );
  };

  return (
    <div className="w-full bg-bg-secondary border border-border rounded-2xl p-6 mt-2">
      <h2 className="font-bold text-lg text-text mb-2">{title}</h2>
      <p className="text-text-secondary">
        {message}{" "}
        <button
          type="button"
          onClick={handleVisit}
          disabled={isPending}
          className="text-primary font-semibold hover:underline disabled:opacity-60"
        >
          {isPending ? "Redirecting…" : "Visit Owners Pulse"}
        </button>
      </p>

      {/* The sub-account can go ACTIVE (usable for SSO) while its GHL SaaS
          plan is still stuck at "setup_pending" — most commonly because no
          payment method has been added on the GHL side yet. That state is
          otherwise invisible to the org owner, so surface it here with a way
          to re-check without waiting on support. */}
      {ghlLocation?.provisioningError && (
        <div className="mt-3 text-[13px] font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p>{ghlLocation.provisioningError}</p>
          <button
            type="button"
            onClick={() => retry()}
            disabled={isRetrying}
            className="mt-1.5 font-semibold hover:underline disabled:opacity-60"
          >
            {isRetrying ? "Checking…" : "Check again"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OpBillingSection;
