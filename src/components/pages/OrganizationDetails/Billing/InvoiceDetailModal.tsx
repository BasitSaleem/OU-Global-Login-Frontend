import React from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import { breakdownToDisplay } from "@/utils/invoiceBreakdown";
import { useInvoiceBreakdown } from "@/apiHooks.ts/invoice/inovice.api";
import logger from "@/utils/logger";

import { SvgIcon } from "@/components/ui/SvgIcon";
import InvoiceModalHeader from "./InvoiceModalHeader";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  orgName: string;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  orgName,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  // Authoritative breakdown (Stripe line items); loaded when the modal opens.
  const { data: breakdown } = useInvoiceBreakdown(invoice?.id, isOpen);
  if (!invoice) return null;

  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata string", e);
    }
  }

  const authoritative = breakdownToDisplay(breakdown);

  // Legacy client-side calc (used only when authoritative data is unavailable).
  const legacy = calculateInvoiceFinancial(
    invoice,
    invoice.subscription?.billing_cycle,
  );

  // Unified rows + summary — same rendering for both authoritative and legacy.
  const rows = authoritative
    ? authoritative.rows
    : [
        {
          name:
            invoice.metadata?.packageName ||
            invoice.subscription?.oiPackage?.package_name ||
            "Subscription",
          type: "Subscription",
          quantity: 1,
          unitPrice: legacy.originalBasePlan,
          amount: legacy.originalBasePlan,
          proration: false,
        },
        ...legacy.addOnsWithPricing.map((addon: any) => {
          const qty = addon.quantity || 1;
          const itemTotal = addon.originalPrice * qty;
          const finalAmount = legacy.hasDiscount
            ? itemTotal - (itemTotal * legacy.discountPercent) / 100
            : itemTotal;
          return {
            name: addon.name || addon.package_name || "Add-on",
            type: "Add-on",
            quantity: qty,
            unitPrice: addon.originalPrice,
            amount: finalAmount,
            proration: false,
          };
        }),
      ];

  const summary = authoritative
    ? authoritative.summary
    : {
        subtotal: legacy.originalSubtotal,
        discount: legacy.savings,
        tax: legacy.tax,
        total: legacy.total,
        currency: invoice.payment?.currency || "USD",
      };
  const showDiscount = summary.discount > 0.001;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      ariaLabel="Invoice Details"
      className="h-fit overflow-y-auto text-white"
      closeButtonClassName="hover:text-white"
    >
      <Modal.Body className="p-0">
        {/* Header */}
        <InvoiceModalHeader />

        <div className="p-8 pt-12 space-y-8">
          {/* Invoice Memo + Status */}
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Invoice Memo</p>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : orgName}
              </h2>
            </div>
            <div className="text-right">
              <div className="flex justify-end mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    invoice.status === "PAID"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-700">
                {invoice.invoice_number}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="max-h-[320px]  overflow-y-auto ">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-bg-secondary p-2 rounded-2xl">
                <tr className="text-text z-20 bg-bg-secondary font-medium border-b border-border text-left">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold text-center">Type</th>
                  <th className="pb-4 font-semibold text-center">Quantity</th>
                  <th className="pb-4 font-semibold text-center">Unit Price</th>
                  <th className="pb-4 font-semibold text-center">Sub-Total</th>
                  {/* <th className="pb-4 font-semibold text-center">Net Total</th> */}
                  {/* <th className="pb-4 font-semibold text-center">Tax</th> */}
                  {/* <th className="pb-4 font-semibold text-center">Discount</th> */}
                  <th className="pb-4 font-semibold text-center">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-4 font-medium text-gray-700">
                      {row.name}
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          row.type === "Subscription"
                            ? "bg-indigo-50 text-indigo-600"
                            : row.type === "Proration"
                              ? "bg-sky-50 text-sky-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="py-4 text-center">{row.quantity}</td>
                    <td className="py-4 text-center">
                      ${row.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-4 text-center">
                      ${(row.unitPrice * row.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 text-center font-bold">
                      ${row.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-between items-start gap-12 bg-background px-4 py-5 rounded-2xl">
            <div className="space-y-4">
              <div>
                <p className="text-text text-xs font-bold uppercase tracking-wider mb-2">
                  Payment Info
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text text-base">
                    Credit Card, {invoice?.payment.payment_method?.last4}
                  </p>
                  <SvgIcon
                    name={invoice?.payment.payment_method?.brand?.toLowerCase()}
                    width={25}
                    height={25}
                  />
                </div>
                <p className="text-text text-sm mt-1">
                  Billed in{" "}
                  <span className="font-bold text-primary">
                    {invoice?.payment.currency}
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-text">
                <span>Subtotal:</span>
                <span className="font-bold text-text">
                  ${summary.subtotal.toFixed(2)}
                </span>
              </div>
              {showDiscount && (
                <div className="flex justify-between text-sm text-text">
                  <span>Discounts:</span>
                  <span className="font-bold text-text">
                    -${summary.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-text">
                <span>Tax:</span>
                <span className="font-bold text-text">
                  ${summary.tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-text">Total:</span>
                <span className="text-3xl font-black text-[#0D9488]">
                  $
                  {summary.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceDetailModal;
