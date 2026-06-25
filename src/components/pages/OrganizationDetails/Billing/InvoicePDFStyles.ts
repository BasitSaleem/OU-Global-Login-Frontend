import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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
    textAlign: "left",
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
    // alignItems: "center",
    // textAlign: "left",
    marginTop: 4,
  },
  invoiceStatusLabel: {
    fontSize: 10,
    color: "#6B7280",
    width: 80,
    textAlign: "left",
  },
  invoiceStatusValue: {
    width: 80,
    alignItems: "flex-end",
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
    display: "none",
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
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#795cf5",
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#3B82F6",
    padding: "10 12",
  },
  tableHeaderItem: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  colType: {
    flex: 1.5,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
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
    alignSelf: "center",
    textAlign: "center",
  },
  itemSubBase: {
    fontSize: 7,
    color: "#4F46E5",
    backgroundColor: "#EEF2FF",
    padding: "2 6",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
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

export const getStatusStyle = (status: string) => {
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
