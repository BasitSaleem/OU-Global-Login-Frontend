import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { pdf } from "@react-pdf/renderer";
import { Download, Eye, Loader2, RefreshCcw } from "lucide-react";

import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import InvoicePDF from "./InvoicePDF";
import { Button } from "@/components/ui";
import { calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import {
  useRetryInvoicePayment,
  fetchInvoiceBreakdown,
} from "@/apiHooks.ts/invoice/inovice.api";
import { formatDate } from "@/utils/helpers";

interface OrgInvoiceItemProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  orgName: string;
}

const OrgInvoiceItem = ({ invoice, onView, orgName }: OrgInvoiceItemProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutateAsync: retryPayment, isPending: isRetrying } =
    useRetryInvoicePayment();
  const [downloading, setDownloading] = useState(false);

  const { originalSubtotal, discountPercent } = calculateInvoiceFinancial(
    invoice,
    invoice.subscription?.billing_cycle,
  );

  // Generate the PDF on click using the authoritative Stripe breakdown (falls
  // back to legacy calc inside InvoicePDF when the breakdown is unavailable).
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const breakdown = await fetchInvoiceBreakdown(invoice.id).catch(
        () => null,
      );
      const blob = await pdf(
        <InvoicePDF
          invoice={invoice}
          orgName={orgName}
          user={user}
          billingCycle={invoice?.subscription?.billing_cycle || "MONTHLY"}
          breakdown={breakdown}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate invoice PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleRepay = async () => {
    if (invoice.status === "PAID") {
      toast.error("Invoice is already paid");
      return;
    }
    try {
      await retryPayment(invoice.id);
      toast.success("Payment successful!");
    } catch (error: any) {
      console.log("Error in handleRepay", error);
      const errorMessage =
        error?.response?.message || error?.message || "Payment retry failed.";
      toast.error(errorMessage);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatDate(invoice.created_at)}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm underline cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {invoice.invoice_number}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
        onClick={() => onView(invoice)}
      >
        ${originalSubtotal.toFixed(2)}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {Number(discountPercent).toFixed(0)}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        $
        {Number(
          invoice.payment?.subtotal ?? invoice.payment?.amount ?? 0,
        ).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${invoice.payment?.tax_amount || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(invoice.amount ?? 0).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
            invoice.status === "PAID"
              ? "bg-green-100 text-green-800"
              : invoice.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {invoice.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center flex justify-center gap-3">
        {invoice.status === "PAID" ? (
          <>
            <button
              onClick={() => onView(invoice)}
              className="hover:text-primary transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye size={18} />
            </button>

            <Button
              variant="basic"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2 cursor-pointer hover:text-primary p-0"
              title="Download PDF"
            >
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
            </Button>
          </>
        ) : (
          <button
            onClick={handleRepay}
            disabled={isRetrying}
            className="hover:text-primary transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
            title="Repay Invoice"
          >
            {isRetrying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCcw className="" size={18} />
            )}
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrgInvoiceItem;
