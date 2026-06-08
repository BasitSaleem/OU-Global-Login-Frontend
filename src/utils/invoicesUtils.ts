import logger from "@/utils/logger";
import { AddOn, Invoice } from "@/apiHooks.ts/invoice/invoice.types";

export const parseAddOns = (
  addOns_raw: any,
  context: string = "General",
): AddOn[] => {
  let addOns: AddOn[] = [];

  if (typeof addOns_raw === "string" && addOns_raw !== "") {
    try {
      addOns = JSON.parse(addOns_raw);
    } catch (e) {
      logger.error(`Failed to parse addOns string in ${context}`, e);
    }
  } else if (Array.isArray(addOns_raw)) {
    addOns = addOns_raw;
  }

  return addOns;
};

export interface InvoiceFinancial {
  originalSubtotal: number;
  savings: number;
  subtotal: number; // Effective pre-tax (Price after discount applied)
  tax: number;
  total: number;
  discountPercent: number;
  hasDiscount: boolean;
  effectiveBasePlan: number;
  originalBasePlan: number;
  addOnsWithPricing: Array<
    AddOn & { originalPrice: number; effectivePrice: number }
  >;
  midCycleAddons: AddOn[];
}

export const isMidCycleInvoice = (invoice: Invoice): boolean => {
  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch {
      return false;
    }
  }
  const midCycle = parseAddOns(metaObj?.midCycleAddons || []);
  const regular = parseAddOns(metaObj?.addOns || metaObj?.addons || []);
  return midCycle.length > 0 && regular.length === 0;
};

export interface MidCycleAddonFinancial {
  subtotal: number; // sum of (price × qty) for all mid-cycle addons only
  tax: number;
  total: number;
  discountPercent: number;
  hasDiscount: boolean;
  midCycleAddons: AddOn[];
  actuallAddonsTotal: number;
}

export const calculateMidCycleAddonFinancial = (
  invoice: Invoice,
): MidCycleAddonFinancial => {
  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata in mid-cycle financial calc", e);
    }
  }

  const midCycleAddons = parseAddOns(metaObj?.midCycleAddons || []);

  // Totla without discount.
  const actuallAddonsTotal =
    midCycleAddons?.reduce((acc: number, addon: any) => {
      console.log("Here is mid cycle add on ", addon);
      return acc + Number(addon.price || 0) * (addon.quantity || 1);
    }, 0) || 0;

  const subtotal = parseFloat(
    String(invoice?.payment?.subtotal || invoice.amount || 0),
  );

  const tax = parseFloat(invoice.payment?.tax_amount || "0");
  const total = parseFloat(
    invoice.payment?.total || invoice.amount?.toString() || "0",
  );

  const discountPercent =
    invoice.subscription?.billing_cycle === "YEARLY"
      ? parseFloat(invoice.subscription?.oiPackage?.yearly_discount || "0")
      : parseFloat("0");

  return {
    subtotal,
    tax,
    total,
    discountPercent: discountPercent,
    hasDiscount: discountPercent > 0 ? true : false,
    midCycleAddons,
    actuallAddonsTotal,
  };
};

export const calculateInvoiceFinancial = (
  invoice: Invoice,
  billingCycle: "MONTHLY" | "YEARLY",
): InvoiceFinancial => {
  const payment = invoice.payment;
  const effectiveSubtotal = parseFloat(payment?.subtotal || "0");
  const tax = parseFloat(payment?.tax_amount || "0");
  const total = parseFloat(payment?.total || invoice.amount.toString());

  // Handle metadata parsing
  let metaObj = invoice.metadata as any;
  if (typeof metaObj === "string" && metaObj !== "") {
    try {
      metaObj = JSON.parse(metaObj);
    } catch (e) {
      logger.error("Failed to parse metadata in financial calc", e);
    }
  }

  const addOns = parseAddOns(metaObj?.addOns || metaObj?.addons || []);
  const midCycleAddons = parseAddOns(metaObj?.midCycleAddons || []);

  // 1. Calculate Add-ons Effective and Original
  let effectiveAddOnsTotal = 0;
  let originalAddOnsTotal = 0;

  const addOnsWithPricing = addOns.map((addon: any) => {
    const qty = addon.quantity || 1;

    // Determine original price based on cycle
    const originalPrice = parseFloat(addon.price || "0");

    // Determine effective price by applying the discount to the original price
    const discountPercent =
      billingCycle === "YEARLY"
        ? parseFloat(addon.yearly_discount || "0")
        : parseFloat(addon.monthly_discount || "0");

    const effectivePrice = originalPrice * (1 - discountPercent / 100);

    effectiveAddOnsTotal += effectivePrice * qty;
    originalAddOnsTotal += originalPrice * qty;

    return {
      ...addon,
      originalPrice,
      effectivePrice,
    };
  });

  // 2. Calculate Base Plan Effective and Original
  // effectiveSubtotal is the pre-tax paid amount.
  // By subtracting effective (paid) addons, we find the effective (paid) base plan.
  const effectiveBasePlan = Math.max(
    0,
    effectiveSubtotal - effectiveAddOnsTotal,
  );

  let originalBasePlan =
    billingCycle === "YEARLY"
      ? parseFloat(invoice.subscription?.oiPackage?.yearly_price || "0")
      : parseFloat(invoice.subscription?.oiPackage?.monthly_price || "0");

  const originalSubtotal = originalBasePlan + originalAddOnsTotal;
  const savings =
    billingCycle === "YEARLY" ? originalSubtotal - effectiveSubtotal : 0;
  const hasDiscount = savings > 0.1;
  const finalDiscountPercent = hasDiscount
    ? (savings / originalSubtotal) * 100
    : 0;

  return {
    originalSubtotal,
    savings,
    subtotal: effectiveSubtotal,
    tax,
    total,
    discountPercent: finalDiscountPercent,
    hasDiscount,
    effectiveBasePlan,
    originalBasePlan,
    addOnsWithPricing,
    midCycleAddons,
  };
};
