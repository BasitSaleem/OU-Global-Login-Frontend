import { useState } from "react";
import { Download, Eye, Loader2, RefreshCcw } from "lucide-react";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { pdf } from "@react-pdf/renderer";
import MidCycleInvoicePDF from "./MidCycleInvoicePDF";
import { Button } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { calculateMidCycleAddonFinancial } from "@/utils/invoicesUtils";
import {
  useRetryInvoicePayment,
  fetchInvoiceBreakdown,
} from "@/apiHooks.ts/invoice/inovice.api";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/helpers";

interface OrgMidCycleInvoiceItemProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  orgName: string;
}

const OrgMidCycleInvoiceItem = ({
  invoice,
  onView,
  orgName,
}: OrgMidCycleInvoiceItemProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutateAsync: retryPayment, isPending: isRetrying } =
    useRetryInvoicePayment();
  const [downloading, setDownloading] = useState(false);

  const paymentSubtotal = invoice?.payment?.subtotal || invoice.amount || "0";
  const { discountPercent, tax, actuallAddonsTotal } =
    calculateMidCycleAddonFinancial(invoice);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const breakdown = await fetchInvoiceBreakdown(invoice.id).catch(
        () => null,
      );
      const blob = await pdf(
        <MidCycleInvoicePDF
          invoice={invoice}
          orgName={orgName}
          user={user}
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
      // retryPayment resolves only after any required 3D Secure challenge has
      // been completed; it throws if authentication fails. The hook invalidates
      // the invoice list on success so the row refreshes.
      await retryPayment(invoice.id);
      toast.success("Payment successful!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error?.message ||
          "Payment retry failed.",
      );
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
        ${Number(actuallAddonsTotal).toFixed(2)}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {discountPercent}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(paymentSubtotal).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(tax).toFixed(2)}
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
              <RefreshCcw size={18} />
            )}
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrgMidCycleInvoiceItem;
