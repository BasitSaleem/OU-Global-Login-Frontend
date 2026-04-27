import { Download, Eye, Loader2 } from "lucide-react";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Button } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { calculateInvoiceFinancial } from "@/utils/invoicesUtils";

interface OrgInvoiceItemProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  orgName: string;
}

const OrgInvoiceItem = ({ invoice, onView, orgName }: OrgInvoiceItemProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { originalSubtotal, discountPercent } = calculateInvoiceFinancial(
    invoice,
    invoice.subscription?.billing_cycle,
  );

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {new Date(invoice.created_at).toLocaleDateString()}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm underline cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {invoice.invoice_number}
      </td>

      <td
        className="px-6 py-4 whitespace-nowrap text-sm  cursor-pointer"
        onClick={() => onView(invoice)}
      >
        ${originalSubtotal.toFixed(2)}
      </td>
      <td
        className="px-6 py-4 whitespace-nowrap text-sm  cursor-pointer"
        onClick={() => onView(invoice)}
      >
        {discountPercent}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {"$"}
        {Number(
          invoice.payment?.subtotal ?? invoice.payment.amount ?? 0,
        ).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {"$"}
        {invoice.payment?.tax_amount || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {/* {invoice.currency.toUpperCase()} */}
        {"$"}

        {Number(invoice.amount ?? 0).toFixed(2)}
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
        {/* <button
          onClick={() =>
            invoice.invoice_pdf_url &&
            window.open(invoice.invoice_pdf_url, "_blank")
          }
          className={`hover:text-primary transition-colors ${!invoice.invoice_pdf_url ? "opacity-30 cursor-not-allowed" : ""}`}
          disabled={!invoice.invoice_pdf_url}
          title="Download Original"
        >
          <Download size={18} />
        </button> */}
      </td>
    </tr>
  );
};

export default OrgInvoiceItem;
