import React from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { parseAddOns, calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import logger from "@/utils/logger";
import { oiLogoBase64 } from "./logoBase64";
import { SvgIcon } from "@/components/ui/SvgIcon";

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
  if (!invoice) return null;
  logger.info("invoice details--------", invoice)
  // 1. Parse metadata if it's a string (happens on some environments)
  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata string", e);
    }
  }

  // const addOns = parseAddOns(
  //   metaObj?.addOns || metaObj?.addons || [],
  //   "DetailModal",
  // );

  const {
    originalSubtotal,
    savings,
    subtotal: effectiveSubtotal,
    tax,
    total,
    discountPercent,
    hasDiscount,
    originalBasePlan,
    addOnsWithPricing,
  } = calculateInvoiceFinancial(invoice, invoice.subscription?.billing_cycle);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      ariaLabel="Invoice Details"
      className="h-fit overflow-y-auto text-white"
    >
      <Modal.Body className="p-0">
        <div className="bg-[#8B5CF6] -m-6 p-8 text-white flex justify-between items-start">
          <div>
            <div className="rounded-full w-fit mb-6">
              <SvgIcon name="OI-white"
                height={60}
                width={60}
              />
            </div>
            <h1 className="text-3xl font-bold">Thanks For your Subscription</h1>
          </div>
          <div className="text-right space-y-1 opacity-90 text-sm">
            <p className="font-bold text-base">Owners Inventory LLC</p>
            <p>support@ownersinventory.com</p>
            <p>www.ownersinventory.com</p>
          </div>
        </div>

        <div className="p-  pt-12 space-y-8">
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Invoice Memo</p>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : orgName}
              </h2>
            </div>
            <div className="text-right">
              <div className="flex justify-end mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${invoice.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-700">{invoice.invoice_number}</p>
            </div>
          </div>

          <div className="max-h-fit overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <table className="w-full text-sm ">
              <thead className="sticky top-0 z-10  p-2 rounded-2xl">
                <tr className="text-text font-medium  border-b border-border text-left">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold text-center">Type</th>
                  <th className="pb-4 font-semibold text-center">Quantity</th>
                  <th className="pb-4 font-semibold text-center">Unit Price</th>
                  <th className="pb-4 font-semibold text-center">Sub-Total</th>
                  <th className="pb-4 font-semibold text-center">Net Total</th>
                  <th className="pb-4 font-semibold text-center">Tax</th>
                  <th className="pb-4 font-semibold text-center">Discount</th>
                  <th className="pb-4 font-semibold text-center">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 font-medium text-gray-700">
                    {invoice.metadata?.packageName || invoice.subscription?.oiPackage?.package_name || "Retail Pro"}
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold">Subscription</span>
                  </td>
                  <td className="py-4 text-center">1</td>
                  <td className="py-4 text-center">${originalBasePlan.toFixed(2)}</td>
                  <td className="py-4 text-center">${originalBasePlan.toFixed(2)}</td>
                  <td className="py-4 text-center">${originalBasePlan.toFixed(2)}</td>
                  <td className="py-4 text-center">$0.00</td>
                  <td className="py-4 text-center text-gray-400">-</td>
                  <td className="py-4 text-center font-bold">${originalBasePlan.toFixed(2)}</td>
                </tr>

                {addOnsWithPricing.map((addon: any, idx: number) => {
                  const qty = addon.quantity || addon.no_of_users || addon.no_of_stores || 1;
                  const price = addon.originalPrice;
                  const itemTotal = price * qty;
                  const itemSavings = hasDiscount ? (itemTotal * discountPercent) / 100 : 0;
                  const finalAmount = itemTotal - itemSavings;

                  return (
                    <tr key={idx}>
                      <td className="py-4 font-medium text-gray-700">
                        {addon.name || addon.package_name || "Module"}
                      </td>
                      <td className="py-4 text-center">
                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold">Add-ons</span>
                      </td>
                      <td className="py-4 text-center">{qty}</td>
                      <td className="py-4 text-center">${price.toFixed(2)}</td>
                      <td className="py-4 text-center">${itemTotal.toFixed(2)}</td>
                      <td className="py-4 text-center">${itemTotal.toFixed(2)}</td>
                      <td className="py-4 text-center">$0.00</td>
                      <td className="py-4 text-center text-emerald-500 font-bold">
                        {hasDiscount ? `-$${itemSavings.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-4 text-center font-bold">${finalAmount.toFixed(2)}</td>
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
                <p className="text-text text-xs font-bold uppercase tracking-wider mb-2">Payment Info</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text text-base">Credit Card, {invoice?.payment.payment_method?.last4}</p>
                  <SvgIcon name={invoice?.payment.payment_method?.brand?.toLowerCase()} width={25} height={25} />
                </div>
                <p className="text-text text-sm mt-1">Billed in <span className="font-bold text-primary">{invoice?.payment.currency}</span></p>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-text">
                <span>Subtotal:</span>
                <span className="font-bold text-text">${originalSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text">
                <span>Discounts:</span>
                <span className="font-bold text-text">-${savings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text">
                <span>Tax:</span>
                <span className="font-bold text-text">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-lg font-bold text-text">Total:</span>
                <span className="text-3xl font-black text-[#0D9488]">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Box */}
          {/* <div className="bg-[#F1EFFE] border-l-4 border-[#8B5CF6] p-5 rounded-r-xl">
            <p className="font-bold text-[#4F46E5] mb-2">Notes:</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your subscription renews automatically on <span className="font-bold text-gray-800">{new Date(invoice.subscription?.current_period_end).toLocaleDateString()}</span>. Add-ons are billed monthly and can be modified anytime from your account dashboard. This invoice serves as an official receipt.
            </p>
          </div> */}

          {/* Footer Links */}
          {/* <div className="text-center text-xs text-gray-400 pt-4 space-y-2">
            <p>Need help? Contact us at <span className="text-indigo-500">support@ownersinventory.com</span></p>
            <p>© {new Date().getFullYear()} <span className="font-bold text-gray-600">Owners Inventory</span> • <span className="text-indigo-500 cursor-pointer">Privacy Policy</span> • <span className="text-indigo-500 cursor-pointer">Terms and Conditions</span></p>
            <p>4254 Normandy Ct, Fredericksburg, VA 22408, United States</p>
          </div> */}
        </div>
        {/* 
        <div className="p-8 pt-0 flex justify-end gap-3">
          <Button variant="basic" onClick={onClose} className="border hover:bg-gray-50">
            Close
          </Button>
          <PDFDownloadLink
            document={
              <InvoicePDF
                invoice={invoice}
                orgName={orgName}
                user={user}
                billingCycle={invoice.subscription?.billing_cycle || "MONTHLY"}
              />
            }
            fileName={`invoice-${invoice.invoice_number}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading} className="gap-2 bg-[#8B5CF6] text-white hover:bg-[#7C3AED]">
                <Download size={16} />
                {loading ? "Preparing..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceDetailModal;
