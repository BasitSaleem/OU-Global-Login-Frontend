import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { OrBillingQuote } from "@/apiHooks.ts/orBilling/orBilling.types";

export interface OrSummaryLine {
  label: string;
  detail?: string;
  amountMinor: number;
}

interface OrOrderSummaryProps {
  title: string;
  lines: OrSummaryLine[];
  quote: OrBillingQuote | undefined;
  isCalculating: boolean;
  hasCountry: boolean;
  isPaymentMethodAvailable: boolean;
  canCheckout: boolean;
  isProcessing: boolean;
  checkoutLabel: string;
  note?: string;
  onCheckout: () => void;
  onManageCards: () => void;
  onAddBillingInfo: () => void;
}

const usd = (minor: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);

// Order summary for Owners Reach purchases; amounts come from the server quote.
const OrOrderSummary: React.FC<OrOrderSummaryProps> = ({
  title,
  lines,
  quote,
  isCalculating,
  hasCountry,
  isPaymentMethodAvailable,
  canCheckout,
  isProcessing,
  checkoutLabel,
  note,
  onCheckout,
  onManageCards,
  onAddBillingInfo,
}) => {
  const listTotal = lines.reduce((sum, line) => sum + line.amountMinor, 0);
  return (
    <div className="bg-bg-secondary border rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-text">{title}</h2>
      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.label} className="flex items-start justify-between gap-3 text-sm">
            <div>
              <p className="text-text font-medium">{line.label}</p>
              {line.detail && <p className="text-xs text-text-secondary">{line.detail}</p>}
            </div>
            <span className="text-text tabular-nums">{usd(line.amountMinor)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 space-y-2 text-sm">
        {!hasCountry ? (
          <p className="text-text-secondary">Add your billing country to see tax and the total.</p>
        ) : isCalculating || !quote ? (
          <p className="text-text-secondary inline-flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Calculating total...
          </p>
        ) : (
          <>
            <div className="flex justify-between text-text-secondary">
              <span>{quote.proration ? "Prorated subtotal" : "Subtotal"}</span>
              <span className="tabular-nums">{usd(quote.subtotalMinor)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tax</span>
              <span className="tabular-nums">{usd(quote.taxMinor)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-text pt-1">
              <span>Due today</span>
              <span className="tabular-nums">{usd(quote.totalMinor)}</span>
            </div>
          </>
        )}
        {quote?.proration && (
          <p className="text-xs text-text-secondary">
            List price {usd(listTotal)}. You pay today less the unused part of your current plan,
            and your new billing period starts now.
          </p>
        )}
      </div>
      {note && <p className="text-xs text-text-secondary">{note}</p>}
      {!isPaymentMethodAvailable ? (
        <Button variant="primary" className="w-full rounded-lg" onClick={onManageCards}>
          Add a card
        </Button>
      ) : !hasCountry ? (
        <Button variant="primary" className="w-full rounded-lg" onClick={onAddBillingInfo}>
          Add billing details
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full rounded-lg"
          disabled={!canCheckout || isProcessing || isCalculating}
          onClick={onCheckout}
        >
          {isProcessing ? "Processing..." : checkoutLabel}
        </Button>
      )}
    </div>
  );
};

export default OrOrderSummary;
