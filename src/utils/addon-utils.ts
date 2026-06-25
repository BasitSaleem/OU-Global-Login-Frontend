import { AddOnType } from "@/apiHooks.ts/addons/addons.types";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";

export const getAvailableAddons = (
  allAddOns: AddOnType[],
  invoices: Invoice[] = [],
): AddOnType[] => {
  const takenAddons = invoices.flatMap((invoice) => [
    ...(invoice?.metadata?.addOns || []),
    ...(invoice?.metadata?.midCycleAddons || []),
  ]);

  const takenAddonIds = new Set(takenAddons.map((addon) => addon.id));

  return allAddOns.filter((addon) => {
    // Quantity-enabled addons can always be purchased
    if (addon.is_quantity_allowed) {
      return true;
    }

    // Non-quantity addons should only appear if not already purchased
    return !takenAddonIds.has(addon.id);
  });
};
