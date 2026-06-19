import { Download, Eye, Loader2, CreditCard, RefreshCcw } from "lucide-react";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MidCycleInvoicePDF from "./MidCycleInvoicePDF";
import { Button } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { calculateMidCycleAddonFinancial } from "@/utils/invoicesUtils";
import { useRetryInvoicePayment } from "@/apiHooks.ts/invoice/inovice.api";
import { toast } from "react-toastify";

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

  const paymentSubtotal = invoice?.payment?.subtotal || invoice.amount || "0";
  const { discountPercent, tax, actuallAddonsTotal } =
    calculateMidCycleAddonFinancial(invoice);

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
      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {new Date(invoice.created_at).toLocaleDateString()}
      </td>

      {/* Invoice number */}
      <td
        className="px-6 py-4 whitespace-nowrap text-sm underline cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {invoice.invoice_number}
      </td>

      {/* Subtotal — addon prices only, no base package */}
      <td
        className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
        onClick={() => onView(invoice)}
      >
        ${Number(actuallAddonsTotal).toFixed(2)}
      </td>

      {/* Discount — always 0% for mid-cycle purchases */}
      <td
        className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {discountPercent}%
      </td>

      {/* Net Total */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(paymentSubtotal).toFixed(2)}
      </td>

      {/* Tax */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(tax).toFixed(2)}
      </td>

      {/* Amount (Stripe grand total) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        ${Number(invoice.amount ?? 0).toFixed(2)}
      </td>

      {/* Status */}
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

      {/* Actions */}
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

            <PDFDownloadLink
              document={
                <MidCycleInvoicePDF
                  invoice={invoice}
                  orgName={orgName}
                  user={user}
                />
              }
              fileName={`invoice-${invoice.invoice_number}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="basic"
                  disabled={loading}
                  className="gap-2 cursor-pointer hover:text-primary p-0"
                >
                  {loading ? <Loader2 size={16} /> : <Download size={16} />}
                </Button>
              )}
            </PDFDownloadLink>
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
