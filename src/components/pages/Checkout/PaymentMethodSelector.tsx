import React from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { brandMap } from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentMethodCard";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  onSelectPaymentMethod: (id: string) => void;
  onManageCards: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  selectedPaymentMethodId,
  onManageCards,
}) => {
  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Payment Method</h2>
        </div>
        <Button
          variant="basic"
          className="text-primary text-sm"
          onClick={onManageCards}
        >
          Manage Cards
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <CreditCard className="w-10 h-10 text-text mx-auto mb-3 opacity-40" />
          <p className="text-sm text-text mb-3">No payment methods found</p>
          <Button variant="primary" onClick={onManageCards} leftIcon={<Plus />}>
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2  transition-all duration-200 ${selectedPaymentMethodId === method.id
                ? "border-primary bg-primary/5"
                : "border-border bg-background"
                }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethodId === method.id}
                onChange={() => { }}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPaymentMethodId === method.id
                  ? "border-primary"
                  : "border-gray-300"
                  }`}
              >
                {selectedPaymentMethodId === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex items-center gap-3 flex-1">
                {method.brand && (
                  <SvgIcon
                    name={brandMap[method.brand]}
                    width={36}
                    height={36}
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    •••• •••• •••• {method.last4}
                  </p>
                  <p className="text-xs text-text">
                    Expires {method.exp_month}/{method.exp_year}
                  </p>
                </div>
              </div>
              {method.is_primary && (
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                  Primary
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
