"use client";

import React from "react";
import { Document, Page, Text, View, Image, Link } from "@react-pdf/renderer";

import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { User } from "@/types/auth.types";
import { calculateMidCycleAddonFinancial } from "@/utils/invoicesUtils";
import { oiLogoBase64 } from "./logoBase64";
import { formatDate } from "@/utils/helpers";
import { styles, getStatusStyle } from "./InvoicePDFStyles";

interface MidCycleInvoicePDFProps {
  invoice: Invoice;
  orgName?: string;
  user: User | null;
}

const MidCycleInvoicePDF: React.FC<MidCycleInvoicePDFProps> = ({
  invoice,
  orgName,
  user,
}) => {
  const statusStyle = getStatusStyle(invoice.status);
  const { subtotal, tax, total, midCycleAddons, discountPercent } =
    calculateMidCycleAddonFinancial(invoice);

  const addonsDiscountedYearlyTotal =
    midCycleAddons?.reduce((acc: number, addon: any) => {
      return acc + Number(addon.price || 0) * (addon.quantity || 1);
    }, 0) *
      ((100 - discountPercent) / 100) || 0;

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
                {formatDate(invoice.subscription.current_period_start)}
              </Text>
            </View>
            <View style={styles.invoiceDateRow}>
              <Text style={styles.invoiceDateLabel}>Due Date:</Text>
              <Text style={styles.invoiceDateValue}>
                {formatDate(invoice.subscription?.current_period_end)}
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
            <Text style={styles.infoText}>{user?.email}</Text>
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
        <View style={styles.table}>
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
            <Text style={[styles.tableHeaderItem, styles.colTotal]}>
              Amount
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
                </View>
                <View style={styles.colType}>
                  <Text style={styles.itemSub}>Mid-cycle</Text>
                </View>
                <Text style={styles.colQty}>{qty}</Text>
                <Text style={styles.colPrice}>${price.toFixed(2)}</Text>
                <Text style={styles.colSub}>${rowTotal.toFixed(2)}</Text>
                <Text style={styles.colTotal}>${rowTotal.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            {invoice?.subscription?.billing_cycle === "YEARLY" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discounted Price:</Text>
                <Text style={styles.summaryValue}>
                  ${addonsDiscountedYearlyTotal.toFixed(2)} (
                  {discountPercent || 0}%)
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal (prorated):</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Paid:</Text>
              <Text style={styles.grandTotalValue}>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>
            This invoice is for a mid-cycle add-on purchase. Prorated charges
            have been applied for the remainder of your current billing period.
            These add-ons will be included in your next regular subscription
            renewal.
          </Text>
        </View>

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

export default MidCycleInvoicePDF;
