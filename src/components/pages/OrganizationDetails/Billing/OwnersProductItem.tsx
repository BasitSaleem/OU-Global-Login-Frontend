import { Tooltip } from "@/components/ui";
import { SvgIcon } from "@/components/ui/SvgIcon";
export type OwnerKey = "inventory" | "jungle" | "marketplace" | "analytics";

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
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${selectedOwner === value
            ? "border-primary bg-primary/5 shadow-sm scale-110"
            : "border-transparent hover:bg-bg-secondary"
            }`}
        >
          <SvgIcon
            name={iconUrl}
            className={`transition-all duration-300 ${selectedOwner === value ? "scale-110" : ""
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
