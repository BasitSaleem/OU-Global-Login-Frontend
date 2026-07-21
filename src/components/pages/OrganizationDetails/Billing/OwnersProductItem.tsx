import { Tooltip } from "@/components/ui";
import { SvgIcon } from "@/components/ui/SvgIcon";
export type OwnerKey =
  | "inventory"
  | "jungle"
  | "marketplace"
  | "analytics"
  | "pulse";

// Maps an ogProduct.product_name to its billing-switcher metadata. Used to show
// only the products an organization actually has.
export const OWNER_META: Record<
  string,
  { value: OwnerKey; toolTipText: string; iconUrl: string }
> = {
  OI: { value: "inventory", toolTipText: "Owners Inventory", iconUrl: "OI" },
  OP: { value: "pulse", toolTipText: "Owners Pulse", iconUrl: "OP" },
  OJ: { value: "jungle", toolTipText: "Owners Jungle", iconUrl: "OJ" },
  OM: { value: "marketplace", toolTipText: "Owners Marketplace", iconUrl: "OM" },
  OA: { value: "analytics", toolTipText: "Owners Analytics", iconUrl: "OA" },
};

interface OwnersProductItemProps {
  selectedOwner: OwnerKey;
  toolTipText: string;
  value: OwnerKey;
  iconUrl: string;
  isDisabled?: boolean;
  setSelectedOwner: (owner: OwnerKey) => void;
}

const OwnersProductItem = ({
  selectedOwner,
  setSelectedOwner,
  toolTipText,
  value,
  iconUrl,
  isDisabled = false,
}: OwnersProductItemProps) => {
  return (
    <div
      className={`relative ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !isDisabled && setSelectedOwner(value)}
    >
      <Tooltip content={toolTipText} position="bottom">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            selectedOwner === value
              ? "border-primary bg-primary/5 shadow-sm scale-110"
              : "border-transparent hover:bg-bg-secondary"
          }`}
        >
          <SvgIcon
            name={iconUrl}
            className={`transition-all duration-300 ${
              selectedOwner === value ? "scale-110" : ""
            }`}
            width={28}
            height={28}
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default OwnersProductItem;
