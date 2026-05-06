import { Download, Eye, Loader2 } from "lucide-react";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Button } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { calculateMidCycleAddonFinancial } from "@/utils/invoicesUtils";

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

  const paymentSubtotal = invoice?.payment?.subtotal || invoice.amount || "0";
  const { discountPercent, tax } = calculateMidCycleAddonFinancial(invoice);
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
        ${Number(paymentSubtotal).toFixed(2)}
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
        <button
          onClick={() => onView(invoice)}
          className="hover:text-primary transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye size={18} />
        </button>

        <PDFDownloadLink
          document={
            <InvoicePDF
              invoice={invoice}
              orgName={orgName}
              user={user}
              billingCycle={invoice?.subscription?.billing_cycle || "MONTHLY"}
            />
          }
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button
              variant="basic"
              disabled={loading}
              className="gap-2 cursor-pointer hover:text-primary"
            >
              {loading ? <Loader2 size={16} /> : <Download size={16} />}
            </Button>
          )}
        </PDFDownloadLink>
      </td>
    </tr>
  );
};

export default OrgMidCycleInvoiceItem;
