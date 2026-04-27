import React, { useMemo } from "react";
import { Check } from "lucide-react";
import { OiPlanType } from "@/apiHooks.ts/plans/plans.types";

interface RenderPackageFeatureProps {
  selectedPlan: OiPlanType;
}

export const getPlanFeatures = (selectedPlan: OiPlanType): string[] => {
  if (!selectedPlan) return [];

  const features: string[] = [];

  // =========================
  // HUMAN RESOURCE
  // =========================
  // if (selectedPlan.show_human_resource) features.push("Human Resource");
  // if (selectedPlan.show_employees)
  //   features.push(`${selectedPlan.no_of_employees} Employee(s)`);
  // if (selectedPlan.show_departments)
  //   features.push(`${selectedPlan.no_of_departments} Department(s)`);
  // if (selectedPlan.show_designations)
  //   features.push(`${selectedPlan.no_of_designations} Designation(s)`);
  // if (selectedPlan.show_payslips)
  //   features.push(`${selectedPlan.no_of_payslips} Payslip(s)`);

  // =========================
  // RESTAURANT
  // =========================
  // if (selectedPlan.show_resturants) features.push("Restaurants");
  // if (selectedPlan.show_floors)
  //   features.push(`${selectedPlan.no_of_floors} Floor(s)`);
  // if (selectedPlan.show_tables)
  //   features.push(`${selectedPlan.no_of_tables} Table(s)`);
  // if (selectedPlan.show_decorations)
  //   features.push(`${selectedPlan.no_of_decorations} Decoration(s)`);

  // =========================
  // INVENTORY OPERATIONS
  // =========================
  // if (selectedPlan.show_inventory_operation)
  // features.push("Inventory Operations");
  // if (selectedPlan.show_transfers)
  //   features.push(`${selectedPlan.no_of_transfers} Transfer(s)`);
  // if (selectedPlan.show_stock_issuing)
  //   features.push(`${selectedPlan.no_of_stock_issuing} Stock Issuing(s)`);
  // if (selectedPlan.show_stock_receiving)
  //   features.push(`${selectedPlan.no_of_stock_receiving} Stock Receiving(s)`);
  // if (selectedPlan.show_stock_adjustments)
  //   features.push(
  //     `${selectedPlan.no_of_stock_adjustments} Stock Adjustment(s)`,
  //   );
  // if (selectedPlan.show_bulk_import_stocks)
  //   features.push(
  //     `${selectedPlan.no_of_bulk_import_stocks} Bulk Stock Import(s)`,
  //   );

  // =========================
  // ECOMMERCE
  // =========================
  // if (selectedPlan.show_ecommerce) features.push("Ecommerce");
  // if (selectedPlan.show_campaigns)
  //   features.push(`${selectedPlan.no_of_campaigns} Campaign(s)`);
  // if (selectedPlan.show_collections)
  //   features.push(`${selectedPlan.no_of_collections} Collection(s)`);
  // if (selectedPlan.show_themes)
  //   features.push(`${selectedPlan.no_of_themes} Theme(s)`);
  // if (selectedPlan.show_orders)
  //   features.push(`${selectedPlan.no_of_orders} Order(s)`);
  // if (selectedPlan.show_discount)
  //   features.push(`${selectedPlan.no_of_discount} Discount(s)`);
  // if (selectedPlan.show_domains)
  //   features.push(`${selectedPlan.no_of_domains} Domain(s)`);
  // // if (selectedPlan.show_marketing) features.push("Marketing");
  // if (selectedPlan.show_coupons)
  //   features.push(`${selectedPlan.no_of_coupons} Coupon(s)`);
  // if (selectedPlan.show_loyalty)
  //   features.push(`${selectedPlan.no_of_loyalty} Loyalty`);

  // =========================
  // MANUFACTURING
  // =========================
  // if (selectedPlan.show_manufacturing) features.push("Manufacturing");
  // if (selectedPlan.show_moulds)
  //   features.push(`${selectedPlan.no_of_moulds} Mould(s)`);
  // if (selectedPlan.show_quality_and_inspections)
  //   features.push(
  //     `${selectedPlan.no_of_quality_and_inspections} Quality Inspection(s)`,
  //   );
  // if (selectedPlan.show_production_orders)
  //   features.push(
  //     `${selectedPlan.no_of_production_orders} Production Order(s)`,
  //   );
  // if (selectedPlan.show_machines)
  //   features.push(`${selectedPlan.no_of_machines} Machine(s)`);

  // =========================
  // ANALYTICS
  // =========================
  // if (selectedPlan.show_analytics) features.push("Analytics");
  // if (selectedPlan.show_manufacturing_reports)
  //   features.push("Manufacturing Report(s)");
  // if (selectedPlan.show_sale_reports) features.push("Sales Report(s)");
  // if (selectedPlan.show_purchase_reports) features.push("Purchase Report(s)");
  // if (selectedPlan.show_inventory_reports) features.push("Inventory Report(s)");
  // if (selectedPlan.show_shift_reports) features.push("Shift Report(s)");
  // if (selectedPlan.show_commission_reports)
  //   features.push("Commission Report(s)");

  // =========================
  // REPORTS / TOOLS
  // =========================
  // if (selectedPlan.show_standard_reports)
  //   features.push(`${selectedPlan.no_of_standard_reports} Standard Report(s)`);
  // if (selectedPlan.show_cash_reports)
  //   features.push(`${selectedPlan.no_of_cash_reports} Cash Report(s)`);
  // if (selectedPlan.show_advance_reports)
  //   features.push(`${selectedPlan.no_of_advance_reports} Advance Report(s)`);
  // // if (selectedPlan.show_general_tools) features.push("General Tools");
  // if (selectedPlan.show_roles)
  //   features.push(`${selectedPlan.no_of_roles} Role(s)`);
  // if (selectedPlan.show_notifications)
  //   features.push(`${selectedPlan.no_of_notifications} Notification(s)`);
  // if (selectedPlan.show_stock_alerts)
  //   features.push(`${selectedPlan.no_of_stock_alerts} Stock Alert(s)`);
  // if (selectedPlan.show_activity_logs)
  //   features.push(`${selectedPlan.no_of_activity_logs} Activity Log(s)`);
  // if (selectedPlan.show_automations)
  //   features.push(`${selectedPlan.no_of_automations} Automation(s)`);

  // =========================
  // INTEGRATIONS
  // =========================
  //  if (selectedPlan.show_integrations) features.push("Integrations");
  // if (selectedPlan.show_fbr) features.push("FBR Integration");
  if (selectedPlan.show_api_call) features.push("API Calls");
  if (selectedPlan.show_stripe) features.push("Stripe");
  if (selectedPlan.show_paypal) features.push("PayPal");
  if (selectedPlan.show_dhl) features.push("DHL");
  if (selectedPlan.show_leopard) features.push("Leopard");
  if (selectedPlan.show_zapier) features.push("Zapier");
  if (selectedPlan.show_make) features.push("Make");

  // =========================
  // FACILITIES
  // =========================
  // if (selectedPlan.show_facilities) features.push("Facilities");
  if (selectedPlan.show_stores)
    features.push(`${selectedPlan.no_of_stores} Store(s)`);
  if (selectedPlan.show_warehouses)
    features.push(`${selectedPlan.no_of_warehouses} Warehouse(s)`);
  if (selectedPlan.show_pos_terminal)
    features.push(`${selectedPlan.no_of_pos_terminal} POS Terminal(s)`);
  if (selectedPlan.show_online_store)
    features.push(`${selectedPlan.no_of_online_store} Online Store(s)`);
  if (selectedPlan.show_production_floor)
    features.push(`${selectedPlan.no_of_production_floor} Production Floor(s)`);

  // =========================
  // FINANCIAL / ACCOUNTING
  // =========================
  if (selectedPlan.show_accounting_and_financial)
    features.push("Accounting & Finance");
  // if (selectedPlan.show_expenses)
  //   features.push(`${selectedPlan.no_of_expenses} Expense(s)`);
  // if (selectedPlan.show_billing_payments)
  //   features.push(`${selectedPlan.no_of_billing_payments} Billing Payment(s)`);
  // if (selectedPlan.show_payable_receivables)
  //   features.push(`${selectedPlan.no_of_payable_receivables} Payable(s)`);
  // if (selectedPlan.show_financial_reports)
  //   features.push(
  //     `${selectedPlan.no_of_financial_reports} Financial Report(s)`,
  //   );
  // if (selectedPlan.show_balance_sheet)
  //   features.push(`${selectedPlan.no_of_balance_sheet} Balance Sheet(s)`);
  // if (selectedPlan.show_chart_of_accounts)
  //   features.push(
  //     `${selectedPlan.no_of_chart_of_accounts} Chart of Account(s)`,
  //   );
  // if (selectedPlan.show_journal_entry_reports)
  //   features.push(
  //     `${selectedPlan.no_of_journal_entry_reports} Journal Report(s)`,
  //   );
  // if (selectedPlan.show_assets)
  //   features.push(`${selectedPlan.no_of_assets} Asset(s)`);

  // =========================
  // PEOPLE / CORE USERS
  // =========================
  // if (selectedPlan.show_people) features.push("People");
  if (selectedPlan.show_users)
    features.push(`${selectedPlan.no_of_users} User(s)`);
  // if (selectedPlan.show_customers)
  //   features.push(`${selectedPlan.no_of_customers} Customer(s)`);
  // if (selectedPlan.show_suppliers)
  //   features.push(`${selectedPlan.no_of_suppliers} Supplier(s)`);

  // =========================
  // PURCHASES
  // =========================
  if (selectedPlan.show_purchases) features.push("Unlimited Purchase(s)");
  // if (selectedPlan.show_purchase_order)
  //   features.push(`${selectedPlan.no_of_purchase_order} Purchase Order(s)`);
  // if (selectedPlan.show_bulk_purchase)
  //   features.push(`${selectedPlan.no_of_bulk_purchase} Bulk Purchase(s)`);

  // =========================
  // PRODUCTS / INVENTORY
  // =========================
  // if (selectedPlan.show_product) features.push("Product Module");
  if (selectedPlan.show_products)
    features.push(`${selectedPlan.no_of_products} Product(s)`);
  // if (selectedPlan.show_categories)
  //   features.push(`${selectedPlan.no_of_categories} Category(s)`);
  // if (selectedPlan.show_brands)
  //   features.push(`${selectedPlan.no_of_brands} Brand(s)`);
  // if (selectedPlan.show_barcode_tracking)
  //   features.push(`${selectedPlan.no_of_barcode_tracking} Barcode Tracking`);
  // if (selectedPlan.show_product_images)
  //   features.push(`${selectedPlan.no_of_product_images} Product Image(s)`);
  // if (selectedPlan.show_bulk_product_import)
  //   features.push(
  //     `${selectedPlan.no_of_bulk_product_import} Bulk Product Import(s)`,
  //   );
  // if (selectedPlan.show_bulk_price_updates)
  //   features.push(
  //     `${selectedPlan.no_of_bulk_price_updates} Bulk Price Update(s)`,
  //   );

  // =========================
  // SALES / POS / ORDERS
  // =========================
  // if (selectedPlan.show_sales_and_orders) features.push("Sales & Orders");
  // if (selectedPlan.show_pos)
  //   features.push(`${selectedPlan.no_of_pos} POS Terminal(s)`);
  // if (selectedPlan.show_invoices)
  features.push(`${selectedPlan.no_of_invoices} Order & Invoice(s)`);
  // if (selectedPlan.show_quotations)
  //   features.push(`${selectedPlan.no_of_quotations} Quotation(s)`);
  // if (selectedPlan.show_sale_orders)
  //   features.push(`${selectedPlan.no_of_sale_orders} Sale Order(s)`);
  // if (selectedPlan.show_sale_returns)
  //   features.push(`${selectedPlan.no_of_sale_returns} Sale Return(s)`);
  // if (selectedPlan.show_hold_sale)
  //   features.push(`${selectedPlan.no_of_hold_sale} Hold Sale(s)`);
  // if (selectedPlan.show_sample_sale)
  //   features.push(`${selectedPlan.no_of_sample_sale} Sample Sale(s)`);

  // =========================
  // API / INTEGRATIONS
  // =========================
  if (selectedPlan.show_api_call)
    features.push(`${selectedPlan.no_of_api_call} API Call(s)`);
  if (selectedPlan.show_stripe)
    features.push(`${selectedPlan.no_of_stripe} Stripe`);
  if (selectedPlan.show_paypal)
    features.push(`${selectedPlan.no_of_paypal} PayPal`);
  if (selectedPlan.show_dhl) features.push(`${selectedPlan.no_of_dhl} DHL`);
  if (selectedPlan.show_leopard)
    features.push(`${selectedPlan.no_of_leopard} Leopard`);
  if (selectedPlan.show_zapier)
    features.push(`${selectedPlan.no_of_zapier} Zapier`);
  if (selectedPlan.show_make) features.push(`${selectedPlan.no_of_make} Make`);

  // =========================
  // SUPPORT
  // =========================
  // if (selectedPlan.show_support) features.push("Support");
  if (selectedPlan.show_onboarding_support && selectedPlan.show_email_support) {
    features.push(`Onboarding Assistance & Email Support`);
  } else if (selectedPlan.show_onboarding_support) {
    features.push(`Onboarding Assistance`);
  } else if (selectedPlan.show_email_support) {
    features.push(`Email Support`);
  }

  if (selectedPlan.show_live_chat_support && selectedPlan.show_phone_support) {
    features.push(`Live Chat Support & Phone Support`);
  } else if (selectedPlan.show_live_chat_support) {
    features.push(`Live Chat Support`);
  } else if (selectedPlan.show_phone_support) {
    features.push(`Phone Support`);
  }

  if (selectedPlan.show_dedicated_account_manager)
    features.push(`Dedicated Account Manager`);

  return features;
};

const RenderPackageFeature: React.FC<RenderPackageFeatureProps> = ({
  selectedPlan,
}) => {
  const planFeatures = useMemo(() => {
    return getPlanFeatures(selectedPlan);
  }, [selectedPlan]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {planFeatures.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500 shrink-0" />

          <span className="text-text">{formatFeature(feature)}</span>
        </div>
      ))}
    </div>
  );
};

export default RenderPackageFeature;
export function formatFeature(text: string) {
  if (!text) return "";

  return (
    text
      // 🔥 remove hidden chars (NBSP, BOM, etc.)
      .replace(/^[\s\uFEFF\xA0]+/, "")
      .trim()

      // normalize
      .toLowerCase()

      // protect (s)
      .replace(/\(s\)/g, "§s§")

      // capitalize properly
      .replace(/(^|\s)\w/g, (c) => c.toUpperCase())

      // restore (s)
      .replace(/§s§/g, "(s)")
  );
}
