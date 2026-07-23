"use client";
import { useGhlSso } from "@/apiHooks.ts/ghl/ghl.api";

// Owners Pulse billing lives entirely in GHL — the portal doesn't display OP
// billing details. Instead it links the user into their Owners Pulse (GHL)
// account. The "Visit Owners Pulse" link triggers RP-initiated SSO via
// /og/ghl/sso and will redirect properly once the white-label SSO is live.
const OpBillingSection = ({ orgId }: { orgId: string }) => {
  const { mutate: openSso, isPending } = useGhlSso();

  const handleVisit = () => {
    if (!orgId) return;
    openSso(
      { orgId },
      {
        onSuccess: (data) => {
          if (data?.redirectUrl) window.location.href = data.redirectUrl;
        },
      },
    );
  };

  return (
    <div className="w-full bg-bg-secondary border border-border rounded-2xl p-6 mt-2">
      <h2 className="font-bold text-lg text-text mb-2">Owners Pulse Billing</h2>
      <p className="text-text-secondary">
        To see billing details, please navigate to your Owners Pulse account.{" "}
        <button
          type="button"
          onClick={handleVisit}
          disabled={isPending}
          className="text-primary font-semibold hover:underline disabled:opacity-60"
        >
          {isPending ? "Redirecting…" : "Visit Owners Pulse"}
        </button>
      </p>
    </div>
  );
};

export default OpBillingSection;
