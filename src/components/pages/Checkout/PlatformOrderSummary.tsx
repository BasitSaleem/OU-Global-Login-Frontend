import React from "react";
import { Loader2 } from "lucide-react";
import { PlatformQuote } from "@/apiHooks.ts/billing/billingGateway.types";
import { formatMinor } from "@/utils/money";
import { formatDate } from "@/utils/helpers";

// Order summary for platform gateways (PayFast). Every amount comes from the
// server quote, so what the customer sees is exactly what will be charged.

interface PlatformOrderSummaryProps {
  quote?: PlatformQuote;
  isQuoting: boolean;
  quoteError?: string | null;
  displayName: string;
  isProcessing: boolean;
  canCheckout: boolean;
  onCheckout: () => void;
}

const PlatformOrderSummary: React.FC<PlatformOrderSummaryProps> = ({
  quote,
  isQuoting,
  quoteError,
  displayName,
  isProcessing,
  canCheckout,
  onCheckout,
}) => {
  const currency = quote?.currency ?? "PKR";

  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {isQuoting ? (
        <div className="flex items-center gap-2 text-sm text-text py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Calculating...
        </div>
      ) : quoteError ? (
        <p className="text-sm text-red-500 py-4">{quoteError}</p>
      ) : quote ? (
        <>
          <div className="space-y-2 text-sm">
            {quote.lines.map((line, idx) => (
              <div key={`${line.kind}-${line.id ?? idx}`} className="flex justify-between gap-3">
                <span className={line.kind === "PRORATION_CREDIT" ? "text-green-600" : ""}>
                  {line.name}
                  {line.quantity > 1 ? ` x${line.quantity}` : ""}
                </span>
                <span className={`font-medium ${line.kind === "PRORATION_CREDIT" ? "text-green-600" : ""}`}>
                  {line.total_minor < 0 ? "- " : ""}
                  {formatMinor(Math.abs(line.total_minor), currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t my-4" />

          <div className="flex justify-between items-baseline">
            <span className="font-semibold">Due today</span>
            <span className="text-xl font-bold text-primary">{formatMinor(quote.dueNowMinor, currency)}</span>
          </div>
          <p className="text-xs text-text mt-1">Inclusive of applicable taxes.</p>
          <p className="text-xs text-text mt-3">
            Plan period: {formatDate(quote.period.start)} to {formatDate(quote.period.end)}. Renewal is not
            charged automatically: we will remind you to pay before the period ends.
          </p>
        </>
      ) : (
        <p className="text-sm text-text py-4">Select your billing country to see the total.</p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={!canCheckout || !quote || isQuoting || isProcessing}
        className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
        {isProcessing
          ? `Opening ${displayName}...`
          : quote
            ? `Pay ${formatMinor(quote.dueNowMinor, currency)} with ${displayName}`
            : `Pay with ${displayName}`}
      </button>
    </div>
  );
};

export default PlatformOrderSummary;
