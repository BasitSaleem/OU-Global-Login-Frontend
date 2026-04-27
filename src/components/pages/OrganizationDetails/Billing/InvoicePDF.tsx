"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";

import { User } from "@/types/auth.types";
import { parseAddOns, calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import logger from "@/utils/logger";

// Note: Standard fonts in @react-pdf/renderer are limited to a few base ones unless registered.
// We'll stick to Helvetica but use weights and sizes to create hierarchy.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1F2937", // text-gray-800
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  brandSection: {
    flexDirection: "column",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
    letterSpacing: 0.5,
  },
  companyAddress: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
    lineHeight: 1.4,
  },
  invoiceTitleSection: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6B7280",
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
    justifyContent: "flex-start", // ← add this to keep label and badge at top
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
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "flex-end", // ← change to flex-end (matches right aligned column)
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: "10 12",
  },
  tableHeaderItem: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4B5563",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: "12 12",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },

  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 8,
    color: "#6B7280",
  },

  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
  },
  summaryGrid: {
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#8B5CF6",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B5CF6",
  },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 20,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },
  notes: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#FDFCFE",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#8B5CF6",
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 1.4,
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

  const addOns = parseAddOns(metaObj?.addOns || metaObj?.addons || [], "PDF");

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
  } = calculateInvoiceFinancial(invoice, billingCycle);

  return (
    <Document title={`Invoice-${invoice.invoice_number}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <View style={styles.logoPlaceholder} />
            <Text style={styles.companyName}>OWNERS UNIVERSE</Text>
            <Text style={styles.companyAddress}>
              support@owners.app{"\n"}
              www.owners.app
            </Text>
          </View>
          <View style={styles.invoiceTitleSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCol, styles.billToCol]}>
            <Text style={styles.infoLabel}>Bill To</Text>

            <Text style={styles.infoText}>
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : invoice.metadata?.customerName}
            </Text>
            <Text style={styles.infoText}>
              {user?.email || invoice.metadata?.customerEmail}
            </Text>
            <Text style={[styles.infoText, { fontWeight: "bold" }]}>
              {orgName}
            </Text>
            {/* <Text style={styles.infoText}>Organization Invoice</Text> */}
          </View>

          <View style={[styles.infoCol, styles.detailsCol]}>
            <Text style={styles.infoLabel}>Details</Text>
            <Text style={styles.infoText}>
              Issued: {new Date(invoice.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>
              Period:{" "}
              {new Date(
                invoice.subscription?.current_period_start ||
                  invoice.billing_period_start,
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(
                invoice.subscription?.current_period_end ||
                  invoice.billing_period_end,
              ).toLocaleDateString()}
            </Text>
          </View>

          <View style={[styles.infoCol, styles.statusCol]}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={[styles.statusBadge, statusStyle]}>
              <Text>{invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* Table */}
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

          {/* Base Plan Row */}
          <View style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={styles.itemTitle}>
                {invoice.metadata?.packageName ||
                  invoice.subscription?.oiPackage?.package_name ||
                  "Subscription Plan"}
              </Text>
              <Text style={styles.itemSub}>
                Recurring billing for organization tools
              </Text>
            </View>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colPrice}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text>
            <Text style={styles.colTotal}>
              {"$"}
              {originalBasePlan.toFixed(2)}
            </Text>
          </View>

          {/* Add-ons Rows */}
          {addOnsWithPricing.map((addon: any, index: number) => {
            const addOnName =
              addon.name || addon.package_name || "Additional Module";
            const addOnQty =
              addon.quantity || addon.no_of_users || addon.no_of_stores || 1;
            const price = addon.originalPrice;
            const total = price * addOnQty;
            return (
              <View style={styles.tableRow} key={index}>
                <View style={styles.colDesc}>
                  <Text style={styles.itemTitle}>{addOnName}</Text>
                  <Text style={styles.itemSub}>Additional module</Text>
                </View>
                <Text style={styles.colQty}>{addOnQty}</Text>
                <Text style={styles.colPrice}>
                  {/* {addon.currency || invoice.currency.toUpperCase()} */}
                  {"$"}
                  {price.toFixed(2)}
                </Text>
                <Text style={styles.colTotal}>
                  {/* {addon.currency || invoice.currency.toUpperCase()} */}
                  {"$"}
                  {total.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            {hasDiscount && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sub total</Text>
                  <Text style={styles.summaryValue}>
                    {"$"}
                    {originalSubtotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Yearly Savings ({discountPercent.toFixed(0)}% Off)
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#059669" }]}>
                    {"-$"}
                    {savings.toFixed(2)}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {"$"}
                {effectiveSubtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {"$"}
                {tax.toFixed(2)}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {"$"}
                {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Important Notes:</Text>
          <Text style={styles.notesText}>
            This invoice was generated automatically. For questions regarding
            your plan or billing, please visit our help center or contact our
            support team.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            OWNERS UNIVERSE - Empowering Organizations Globally{"\n"}
            This is a computer-generated document. No signature is required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
