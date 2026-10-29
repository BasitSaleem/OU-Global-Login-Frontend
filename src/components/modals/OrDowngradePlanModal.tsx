"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrDowngrade, useOrDowngradePreview } from "@/apiHooks.ts/orBilling/orBilling.api";
import { formatDate } from "@/utils/helpers";

interface OrDowngradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  // The smaller plan the customer picked; null while the modal is closed.
  planId: string | null;
}

const usd = (minor: number | null) =>
  minor === null
    ? "-"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(minor / 100);
const count = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, one: string, many: string) => `${count(n)} ${n === 1 ? one : many}`;

// Confirms a move to a smaller plan at the next renewal: what changes, when,
// and which limits the team is already over.
const OrDowngradePlanModal: React.FC<OrDowngradePlanModalProps> = ({ isOpen, onClose, orgId, planId }) => {
  const { data: preview, isLoading, error } = useOrDowngradePreview(orgId, isOpen ? planId : null);
  const { mutateAsync: downgrade, isPending } = useOrDowngrade(orgId);

  const handleConfirm = async () => {
    if (!planId) return;
    try {
      await downgrade(planId);
      onClose();
    } catch {
      // The hook shows the error.
    }
  };

  const date = preview?.effectiveDate ? formatDate(preview.effectiveDate) : "the end of your billing period";
  const per = preview?.billingCycle === "YEARLY" ? "year" : "month";
  const extraSeats = preview ? Math.max(0, preview.seats.members - preview.seats.limit) : 0;
  const rows = preview
    ? [
        { label: "Price", current: `${usd(preview.current.priceMinor)}/${per}`, next: `${usd(preview.target.priceMinor)}/${per}` },
        { label: "Credits every month", current: count(preview.current.includedCredits), next: count(preview.target.includedCredits) },
        { label: "Team seats", current: count(preview.current.seats), next: count(preview.target.seats) },
        { label: "Concurrent runs", current: count(preview.current.concurrentRuns), next: count(preview.target.concurrentRuns) },
        { label: "Active campaigns", current: count(preview.current.maxPipelines), next: count(preview.target.maxPipelines) },
        { label: "Leads per run", current: count(preview.current.leadsPerRun), next: count(preview.target.leadsPerRun) },
        { label: "Leads per day", current: count(preview.current.leadsPerDay), next: count(preview.target.leadsPerDay) },
      ]
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>{preview ? `Downgrade to ${preview.target.name}` : "Downgrade plan"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton width="100%" height={20} />
            <Skeleton width="100%" height={160} />
          </div>
        ) : error || !preview ? (
          <p className="text-sm text-red-500">
            {(error as Error)?.message || "This plan change is not available right now."}
          </p>
        ) : (
          <div className="space-y-4 text-sm text-text">
            <p>
              You keep your {preview.current.name} plan until <strong>{date}</strong>. From then you are billed{" "}
              {usd(preview.target.priceMinor)}/{per} for {preview.target.name}. The current period is not refunded,
              and you can keep your current plan any time before {date}.
            </p>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-bg-secondary text-text-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium" />
                    <th className="px-3 py-2 text-left font-medium">{preview.current.name} (now)</th>
                    <th className="px-3 py-2 text-left font-medium">{preview.target.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-border">
                      <td className="px-3 py-2 text-text-secondary">{row.label}</td>
                      <td className="px-3 py-2">{row.current}</td>
                      <td className="px-3 py-2 font-semibold">{row.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {extraSeats > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>
                  Your team has {plural(preview.seats.members, "member", "members")} and {preview.target.name} has{" "}
                  {plural(preview.seats.limit, "seat", "seats")}. After {date}, new runs pause until you remove{" "}
                  {plural(extraSeats, "member", "members")}. Nobody loses access and no data is deleted.
                </span>
              </div>
            )}
            {preview.seats.invitations > 0 && (
              <p className="text-text-secondary">
                Open invitations ({count(preview.seats.invitations)}) can only be accepted while a seat is free.
              </p>
            )}
            <p className="text-text-secondary">
              If more than {plural(preview.target.maxPipelines, "campaign is", "campaigns are")} active or paused on{" "}
              {date}, new runs pause until you mark the extra ones as completed. Purchased credits never expire, and
              this month&apos;s credits stay until the month ends.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Keep current plan
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={isPending || !preview}>
          {isPending ? "Scheduling..." : "Schedule downgrade"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrDowngradePlanModal;
