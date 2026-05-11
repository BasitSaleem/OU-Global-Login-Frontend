import React from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { calculateMidCycleAddonFinancial } from "@/utils/invoicesUtils";
import { SvgIcon } from "@/components/ui/SvgIcon";
import InvoiceModalHeader from "./InvoiceModalHeader";

interface MidCycleInvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  orgName: string;
}

const MidCycleInvoiceDetailModal: React.FC<MidCycleInvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  orgName,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!invoice) return null;

  const { subtotal, tax, total, midCycleAddons } =
    calculateMidCycleAddonFinancial(invoice);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      ariaLabel="Mid-Cycle Invoice Details"
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
          <div className="max-h-[320px] overflow-y-auto pr-2 ">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-bg-secondary p-2 rounded-2xl">
                <tr className="text-text font-medium border-b border-border text-left">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold text-center">Type</th>
                  <th className="pb-4 font-semibold text-center">Quantity</th>
                  <th className="pb-4 font-semibold text-center">Unit Price</th>
                  <th className="pb-4 font-semibold text-center">Sub-Total</th>
                  <th className="pb-4 font-semibold text-center">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {midCycleAddons?.map((addon: any, idx: number) => {
                  const qty = addon.quantity || 1;
                  const price = parseFloat(addon.price || "0");
                  const itemTotal = price * qty;
                  return (
                    <tr key={`mid-cycle-${idx}`}>
                      <td className="py-4 font-medium text-gray-700">
                        {addon.name || "Add-on Module"}
                        <p className="text-xs text-gray-400 font-normal">
                          Prorated purchase
                        </p>
                      </td>
                      <td className="py-4 text-center">
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold">
                          Mid-cycle
                        </span>
                      </td>
                      <td className="py-4 text-center">{qty}</td>
                      <td className="py-4 text-center">${price.toFixed(2)}</td>
                      <td className="py-4 text-center">
                        ${itemTotal.toFixed(2)}
                      </td>
                      <td className="py-4 text-center font-bold">
                        ${itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
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
                    {invoice?.payment?.payment_method?.brand} ••••{" "}
                    {invoice?.payment?.payment_method?.last4}
                  </p>
                  <SvgIcon
                    name={invoice?.payment?.payment_method?.brand?.toLowerCase()}
                    width={25}
                    height={25}
                  />
                </div>
                <p className="text-text text-sm mt-1">
                  Billed in{" "}
                  <span className="font-bold text-primary">
                    {invoice?.payment?.currency}
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-text">
                <span>Subtotal:</span>
                <span className="font-bold text-text">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-text">
                <span>Tax:</span>
                <span className="font-bold text-text">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-text">Total Due:</span>
                <span className="text-3xl font-black text-[#0D9488]">
                  $
                  {total.toLocaleString(undefined, {
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

export default MidCycleInvoiceDetailModal;
