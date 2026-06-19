"use client";

import React from "react";
import { Document, Page, Text, View, Image, Link } from "@react-pdf/renderer";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";

import { User } from "@/types/auth.types";
import { calculateInvoiceFinancial } from "@/utils/invoicesUtils";
import logger from "@/utils/logger";
import { oiLogoBase64 } from "./logoBase64";
import { formatDate } from "@/utils/helpers";
import { styles, getStatusStyle } from "./InvoicePDFStyles";

interface InvoicePDFProps {
  invoice: Invoice;
  orgName?: string;
  billingCycle: "MONTHLY" | "YEARLY";
  user: User | null;
}

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
    tax,
    total,
    discountPercent,
    hasDiscount,
    originalBasePlan,
    addOnsWithPricing,
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
              <Text style={styles.invoiceDateValue}>
                {invoice.invoice_number}
              </Text>
            </View>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Issue Date:</Text>
              <Text style={styles.invoiceDateValue}>
                {formatDate(invoice.subscription?.current_period_start)}
              </Text>
            </View>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Due Date:</Text>
              <Text style={styles.invoiceDateValue}>
                {formatDate(
                  invoice.subscription?.current_period_end ||
                    invoice.billing_period_end,
                )}
              </Text>
            </View>
            <View style={styles.invoiceStatusRow}>
              <Text style={styles.invoiceStatusLabel}>Status:</Text>
              <View style={styles.invoiceStatusValue}>
                <View style={[styles.statusBadge, statusStyle]}>
                  <Text>{invoice.status}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCol, styles.billToCol]}>
            <Text style={[styles.infoText, { fontWeight: "bold" }]}>
              Bill To:
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  fontWeight: "bold",
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 4,
                },
              ]}
            >
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : orgName}
            </Text>
            <Text style={styles.infoText}>
              {invoice.metadata?.customerEmail || user?.email}
            </Text>
            <Text style={styles.infoText}>{orgName}</Text>
          </View>

          <View style={[styles.infoCol, styles.detailsCol]}>
            <Text style={[styles.infoText, { fontWeight: "bold" }]}>
              Payment Method
            </Text>
            <Text style={styles.infoText}>
              {invoice?.payment?.payment_method?.brand} ••••{" "}
              {invoice?.payment?.payment_method?.last4}
            </Text>
            <Text style={styles.infoText}>
              Paid on {formatDate(invoice.created_at)}
            </Text>
          </View>
        </View>
        {/* Table */}
        <View style={[styles.table]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderItem, styles.colDesc]}>
              Product
            </Text>
            <Text style={[styles.tableHeaderItem, styles.colType]}>Type</Text>
            <Text style={[styles.tableHeaderItem, styles.colQty]}>
              Quantity
            </Text>
            <Text style={[styles.tableHeaderItem, styles.colPrice]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderItem, styles.colSub]}>
              Sub-Total
            </Text>
            {/* <Text style={[styles.tableHeaderItem, styles.colNet]}>Net Total</Text> */}
            {/* <Text style={[styles.tableHeaderItem, styles.colTax]}>Tax</Text> */}
            {/* <Text style={[styles.tableHeaderItem, styles.colDiscount]}>Discount</Text> */}
            <Text style={[styles.tableHeaderItem, styles.colTotal]}>
              Amount
            </Text>
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
                {
                  <Text style={styles.colTotal}>
                    {"$"}
                    {hasDiscount
                      ? (total - (price * discountPercent) / 100).toFixed(2)
                      : total.toFixed(2)}
                  </Text>
                }
              </View>
            );
          })}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                $
                {originalSubtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            {invoice?.subscription?.billing_cycle === "YEARLY" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>
                  -$
                  {savings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>
                $
                {tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>
            Your subscription renews automatically on{" "}
            <Text style={{ fontWeight: "bold" }}>
              {formatDate(
                invoice.subscription?.current_period_end ||
                  invoice.billing_period_end,
              )}
            </Text>
            . Add-ons are billed monthly and can be modified anytime from your
            account dashboard. This invoice serves as an official receipt.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact us at{" "}
            <Link
              href="mailto:support@ownersinventory.com"
              style={{ color: "#8B5CF6" }}
            >
              support@ownersinventory.com
            </Link>
            {"\n"}© {new Date().getFullYear()}{" "}
            <Text style={{ color: "#4B5563", fontWeight: "bold" }}>
              Owners Inventory
            </Text>{" "}
            •{" "}
            <Link
              href="https://ownersinventory.com/privacy-policy"
              style={{ color: "#8B5CF6" }}
            >
              Privacy Policy
            </Link>{" "}
            •{" "}
            <Link
              href="https://ownersinventory.com/terms-and-conditions"
              style={{ color: "#8B5CF6" }}
            >
              Terms and Conditions
            </Link>
            {"\n"}
            <Link
              href="https://maps.google.com/?q=4254+Normandy+Ct+Fredericksburg+VA+22408"
              style={{ color: "#8B5CF6" }}
            >
              4254 Normandy Ct, Fredericksburg, VA 22408, United States
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
