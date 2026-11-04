import React from "react";
import { ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { PaymentMethodOption } from "@/apiHooks.ts/billing/billingGateway.types";

// Payment section for platform gateways (PayFast). The customer picks card,
// JazzCash, Easypaisa, bank account, ... on PayFast's secure page, so we only
// show what is accepted and collect the mobile number PayFast requires.

interface PayFastPanelProps {
  displayName: string;
  methods: PaymentMethodOption[];
  phone: string;
  onPhoneChange: (value: string) => void;
  phoneError?: string | null;
}

const PK_MOBILE = /^(\+92|0092|92|0)?3\d{9}$/;
export const isValidPkMobile = (value: string) => PK_MOBILE.test(value.replace(/[\s-]/g, ""));

const PayFastPanel: React.FC<PayFastPanelProps> = ({
  displayName,
  methods,
  phone,
  onPhoneChange,
  phoneError,
}) => (
  <div className="bg-bg-secondary border rounded-xl p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Wallet className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Pay with {displayName}</h2>
        <p className="text-xs text-text">Pakistani cards, mobile wallets and bank accounts</p>
      </div>
    </div>

    {methods.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-5">
        {methods.map((m) => (
          <span key={m.id} className="text-xs font-medium px-3 py-1.5 rounded-full border bg-background">
            {m.label}
          </span>
        ))}
      </div>
    )}

    <label className="block text-sm font-medium mb-2">
      Mobile number <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-background">
      <Smartphone className="w-4 h-4 text-text" />
      <input
        className="flex-1 bg-transparent outline-none text-sm"
        placeholder="03XX XXXXXXX"
        inputMode="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />
    </div>
    {phoneError ? (
      <p className="text-xs text-red-500 mt-1">{phoneError}</p>
    ) : (
      <p className="text-xs text-text mt-1">Used by {displayName} for payment confirmation (OTP / wallet approval).</p>
    )}

    <div className="flex items-start gap-2 mt-5 text-xs text-text">
      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
      <p>
        You will be taken to {displayName}&apos;s secure page to complete the payment, then brought back here.
        We never see or store your card or wallet details.
      </p>
    </div>
  </div>
);

export default PayFastPanel;
