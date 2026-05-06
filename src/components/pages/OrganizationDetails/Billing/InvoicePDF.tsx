"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";

import { User } from "@/types/auth.types";
import { parseAddOns, calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import logger from "@/utils/logger";
import { oiLogoBase64 } from "./logoBase64";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  brandSection: {
    flexDirection: "column",
    gap: 5,
  },
  logoPlaceholder: {
    width: 45,
    height: 40,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.5,
  },
  invoiceTitleSection: {
    flex: 1,
    alignItems: "flex-end",
    gap: 5,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  invoiceDateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDateLabel: {
    fontSize: 10,
    color: "#6B7280",
    width: 80,
    textAlign: "right",
  },
  invoiceDateValue: {
    fontSize: 10,
    color: "#6B7280",
    width: 80,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  invoiceStatusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  invoiceStatusLabel: {
    fontSize: 10,
    color: "#6B7280",
    width: 80,
    textAlign: "right",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoCol: {
    flexDirection: "column",
  },
  billToCol: {
    width: "45%",
  },
  detailsCol: {
    width: "35%",
    textAlign: "right",
  },
  statusCol: {
    width: "20%",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    display: "none", // Hide the status column in details section
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 8,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#3B82F6",
    padding: "10 12",
  },
  tableHeaderItem: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: "12 12",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  colDesc: { flex: 2 },
  colType: { flex: 1.5, textAlign: "center" },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "center" },
  colSub: { flex: 1.5, textAlign: "center" },
  colNet: { flex: 1.5, textAlign: "center" },
  colTax: { flex: 1, textAlign: "center" },
  colDiscount: { flex: 1.5, textAlign: "center" },
  colTotal: { flex: 1.5, textAlign: "right" },

  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 7,
    color: "#D97706",
    backgroundColor: "#FEF3C7",
    padding: "2 6",
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  itemSubBase: {
    fontSize: 7,
    color: "#4F46E5",
    backgroundColor: "#EEF2FF",
    padding: "2 6",
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  summarySection: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  summaryGrid: {
    width: "100%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "left",
  },
  summaryValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left",
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    textAlign: "right",
  },

  footer: {
    position: "relative",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 20,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },
  notes: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#F1EFFE",
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#4B5563",
    lineHeight: 1.5,
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  orgName?: string;
  billingCycle: "MONTHLY" | "YEARLY";
  user: User | null;
}

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID":
      return { backgroundColor: "#DEF7EC", color: "#03543F" };
    case "PENDING":
      return { backgroundColor: "#FEF3C7", color: "#92400E" };
    case "DRAFT":
      return { backgroundColor: "#F3F4F6", color: "#374151" };
    default:
      return { backgroundColor: "#FDE8E8", color: "#9B1C1C" };
  }
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  orgName,
  user,
  billingCycle,
}) => {
  const statusStyle = getStatusStyle(invoice.status);

  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata string in PDF", e);
    }
  }

  const {
    originalSubtotal,
    savings,
    subtotal: effectiveSubtotal,
    tax,
    total,
    discountPercent,
    hasDiscount,
    effectiveBasePlan,
    originalBasePlan,
    addOnsWithPricing,
    midCycleAddons,
  } = calculateInvoiceFinancial(invoice, billingCycle);

  return (
    <Document title={`Invoice-${invoice.invoice_number}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Image style={styles.logoPlaceholder} src={oiLogoBase64} />
            <Text style={styles.companyName}>Owners Inventory LLC</Text>
            <Text style={styles.companyAddress}>
              support@ownersinventory.com{"\n"}
              www.ownersinventory.com
            </Text>
          </View>
          <View style={styles.invoiceTitleSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Invoice:</Text>
              <Text style={styles.invoiceDateValue}>{invoice.invoice_number}</Text>
            </View>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Issue Date:</Text>
              <Text style={styles.invoiceDateValue}>{new Date(invoice.created_at).toLocaleDateString()}</Text>
            </View>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Due Date:</Text>
              <Text style={styles.invoiceDateValue}>
                {new Date(
                  invoice.subscription?.current_period_end ||
                  invoice.billing_period_end || Date.now()
                ).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.invoiceStatusRow}>
              <Text style={styles.invoiceStatusLabel}>Status:</Text>
              <View style={[styles.statusBadge, statusStyle]}>
                <Text>{invoice.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCol, styles.billToCol]}>
            <Text style={[styles.infoText, { fontWeight: "bold" }]}>Bill To:</Text>
            <Text style={[styles.infoText, { fontWeight: "bold", fontSize: 12, marginTop: 4, marginBottom: 4 }]}>
              {invoice.metadata?.customerName || user?.first_name
                ? `${invoice.metadata?.customerName || user?.first_name} ${user?.last_name || ""}`
                : orgName}
            </Text>
            <Text style={styles.infoText}>
              {invoice.metadata?.customerEmail || user?.email}
            </Text>
            <Text style={styles.infoText}>
              {orgName}
            </Text>
          </View>

          <View style={[styles.infoCol, styles.detailsCol]}>
            <Text style={[styles.infoText, { fontWeight: "bold" }]}>Payment Method</Text>
            <Text style={styles.infoText}>
              Credit Card •••• 4242
            </Text>
            <Text style={styles.infoText}>
              Paid on {new Date(invoice.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {/* Table */}
        <View style={[styles.table]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderItem, styles.colDesc]}>Product</Text>
            <Text style={[styles.tableHeaderItem, styles.colType]}>Type</Text>
            <Text style={[styles.tableHeaderItem, styles.colQty]}>Quantity</Text>
            <Text style={[styles.tableHeaderItem, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderItem, styles.colSub]}>Sub-Total</Text>
            {/* <Text style={[styles.tableHeaderItem, styles.colNet]}>Net Total</Text> */}
            {/* <Text style={[styles.tableHeaderItem, styles.colTax]}>Tax</Text> */}
            {/* <Text style={[styles.tableHeaderItem, styles.colDiscount]}>Discount</Text> */}
            <Text style={[styles.tableHeaderItem, styles.colTotal]}>Amount</Text>
          </View>

          {/* Base Plan Row */}
          <View style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={styles.itemTitle}>
                {invoice.metadata?.packageName ||
                  invoice.subscription?.oiPackage?.package_name ||
                  "Retail Basic"}
              </Text>
            </View>
            <View style={styles.colType}>
              <Text style={styles.itemSubBase}>Subscription</Text>
            </View>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colPrice}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text>
            <Text style={styles.colSub}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text>
            {/* <Text style={styles.colNet}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text> */}
            {/* <Text style={styles.colTax}>$0.00</Text> */}
            {/* <Text style={styles.colDiscount}>-</Text> */}
            <Text style={styles.colTotal}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text>
          </View>


          {/* Add-ons Rows */}
          {addOnsWithPricing.map((addon: any, index: number) => {
            const addOnName =
              addon.name || addon.package_name || "Additional Module";
            const addOnQty = addon.quantity || 1;
            const price = addon.originalPrice;
            const total = price * addOnQty;
            return (
              <View style={styles.tableRow} key={index}>
                <View style={styles.colDesc}>
                  <Text style={styles.itemTitle}>{addOnName}</Text>
                </View>
                <View style={styles.colType}>
                  <Text style={styles.itemSub}>Add-ons</Text>
                </View>
                <Text style={styles.colQty}>{addOnQty}</Text>
                <Text style={styles.colPrice}>
                  {"$"}
                  {price.toFixed(2)}
                </Text>
                <Text style={styles.colSub}>
                  {"$"}
                  {total.toFixed(2)}
                </Text>
                <Text style={styles.colNet}>
                  {"$"}
                  {total.toFixed(2)}
                </Text>
                <Text style={styles.colTax}>$0.00</Text>
                <Text style={[styles.colDiscount, { color: "#10B981" }]}>
                  {hasDiscount ? `-$${((price * discountPercent) / 100).toFixed(2)}` : "-"}
                </Text>
                <Text style={styles.colTotal}>
                  {"$"}
                  {hasDiscount ? (total - (price * discountPercent) / 100).toFixed(2) : total.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Mid-Cycle Add-Ons Section — only rendered when present */}
        {midCycleAddons.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Mid-Cycle Add-Ons
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderItem, styles.colDesc]}>
                  Description
                </Text>
                <Text style={[styles.tableHeaderItem, styles.colQty]}>Qty</Text>
                <Text style={[styles.tableHeaderItem, styles.colPrice]}>
                  Unit Price
                </Text>
                <Text style={[styles.tableHeaderItem, styles.colTotal]}>
                  Subtotal
                </Text>
              </View>
              {midCycleAddons.map((addon, index) => {
                const qty = addon.quantity || 1;
                const price = parseFloat(addon.price || "0");
                const rowTotal = price * qty;
                return (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.colDesc}>
                      <Text style={styles.itemTitle}>
                        {addon.name || "Add-on Module"}
                      </Text>
                      <Text style={styles.itemSub}>Mid-cycle purchase</Text>
                    </View>
                    <Text style={styles.colQty}>{qty}</Text>
                    <Text style={styles.colPrice}>${price.toFixed(2)}</Text>
                    <Text style={styles.colTotal}>${rowTotal.toFixed(2)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${originalSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                -${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (0%):</Text>
              <Text style={styles.summaryValue}>
                ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>
            Your subscription renews automatically on <Text style={{ fontWeight: "bold" }}>{new Date(
              invoice.subscription?.current_period_end ||
              invoice.billing_period_end || Date.now()
            ).toLocaleDateString()}</Text>. Add-ons are billed monthly and can be modified anytime from your account dashboard. This invoice serves as an official receipt.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact us at <Text style={{ color: "#8B5CF6" }}>support@ownersinventory.com</Text>{"\n"}
            © {new Date().getFullYear()} <Text style={{ color: "#4B5563", fontWeight: "bold" }}>Owners Inventory</Text> • <Text style={{ color: "#8B5CF6" }}>Privacy Policy</Text> • <Text style={{ color: "#8B5CF6" }}>Terms and Conditions</Text>{"\n"}
            4254 Normandy Ct, Fredericksburg, VA 22408, United States
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
