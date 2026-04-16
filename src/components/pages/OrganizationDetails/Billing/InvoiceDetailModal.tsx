import React from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import { Subscription } from "@/apiHooks.ts/organization/organization.types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import logger from "@/utils/logger";

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
  const payment = invoice.payment;

  // 1. Parse metadata if it's a string (happens on some environments)
  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata string", e);
    }
  }

  // 2. Extract add-ons with case-insensitive check and parsing
  let addOns_raw = metaObj?.addOns || metaObj?.addons || [];
  let addOns: any[] = [];
  if (typeof addOns_raw === "string" && addOns_raw !== "") {
    try {
      addOns = JSON.parse(addOns_raw);
    } catch (e) {
      logger.error("Failed to parse addOns string", e);
    }
  } else if (Array.isArray(addOns_raw)) {
    addOns = addOns_raw;
  }

  const addOnsTotal = addOns.reduce((acc: number, addon: any) => {
    const qty = addon.quantity || addon.no_of_users || addon.no_of_stores || 1;
    const price = parseFloat(addon.price) || 0;
    return acc + price * qty;
  }, 0);

  const basePlanAmount = invoice.amount - addOnsTotal;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel="Invoice Details"
    >
      <Modal.Header>
        <div className="flex items-center gap-2">
          <FileText className="text-primary w-6 h-6" />
          <Modal.Title>Invoice #{invoice.invoice_number}</Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-8 py-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">
              Bill To
            </p>
            <p className="text-sm text-text">
              {user?.first_name + " " + user?.last_name}
            </p>
            <p className="text-sm text-text">{user?.email}</p>
            <p className="font-semibold text-text">{orgName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">
              Billing Period
            </p>
            <p className="text-sm">
              {new Date(
                invoice.subscription?.current_period_start,
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(
                invoice.subscription?.current_period_end,
              ).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 uppercase font-bold mt-3 mb-1">
              Date Issued
            </p>
            <p className="text-sm">
              {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div
          className={`overflow-y-auto ${addOns.length > 3 ? "max-h-64" : ""}`}
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b">
              <tr>
                <th className="px-4 py-2 font-semibold">Description</th>
                <th className="px-4 py-2 font-semibold text-center">Qty</th>
                <th className="px-4 py-2 font-semibold text-right">
                  Unit Price
                </th>
                <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* Base Plan */}
              <tr>
                <td className="px-4 py-2">
                  <p className="font-medium">
                    {invoice.metadata?.packageName ||
                      invoice.subscription?.oiPackage?.package_name ||
                      "Subscription Plan"}
                  </p>
                  <p className="text-xs text-gray-500">Base subscription fee</p>
                </td>
                <td className="px-4 py-2 text-center">1</td>
                <td className="px-4 py-2 text-right">
                  {/* {invoice.currency.toUpperCase()} */}
                  {"$"}
                  {basePlanAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  {/* {invoice.currency.toUpperCase()} */}
                  {"$"}
                  {basePlanAmount.toFixed(2)}
                </td>
              </tr>

              {/* Add-ons */}
              {addOns.map((addon: any, index: number) => {
                const addOnName =
                  addon.name || addon.package_name || "Add-on Module";
                const addOnQty =
                  addon.quantity ||
                  addon.no_of_users ||
                  addon.no_of_stores ||
                  1;
                const price = parseFloat(addon.price) || 0;
                const total = price * addOnQty;
                return (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <p className="font-medium">{addOnName}</p>
                      <p className="text-xs text-gray-500">Additional module</p>
                    </td>
                    <td className="px-4 py-4 text-center">{addOnQty}</td>
                    <td className="px-4 py-4 text-right">
                      {/* {addon.currency || invoice.currency.toUpperCase()} */}
                      {"$"}
                      {price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      {/* {addon.currency || invoice.currency.toUpperCase()} */}
                      {"$"}
                      {total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-start p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div>
            <p className="text-xs text-primary/60 uppercase font-bold">
              Status
            </p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${invoice.status === "PAID"
                ? "bg-green-100 text-green-700"
                : invoice.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <div className="flex justify-between gap-8 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-text">
                {"$"}
                {payment?.subtotal || (invoice.amount - addOnsTotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-8 text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-semibold text-text">
                {"$"}
                {payment?.tax_amount || "0.00"}
              </span>
            </div>
            <div className="pt-2 border-t border-primary/10">
              <p className="text-xs text-primary/60 uppercase font-bold">
                Total
              </p>
              <p className="text-2xl font-bold text-primary">
                {"$"}
                {payment?.total || invoice.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="basic" onClick={onClose} className="border">
          Close
        </Button>
        <PDFDownloadLink
          document={
            <InvoicePDF invoice={invoice} orgName={orgName} user={user} />
          }
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} className="gap-2">
              <Download size={16} />
              {loading ? "Preparing..." : "Download"}
            </Button>
          )}
        </PDFDownloadLink>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceDetailModal;
