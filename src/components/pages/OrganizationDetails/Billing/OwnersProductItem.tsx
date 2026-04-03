import Image from "next/image";

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
      className={`relative group  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !isDisabled && setSelectedOwner(value)}
    >
      <Image
        src={iconUrl}
        alt={toolTipText}
        width={20}
        height={20}
        className={`w-8 h-8 rounded-lg p-1 transition border ${
          selectedOwner === value
            ? "border-primary bg-bg-secondary"
            : "border-transparent"
        }`}
      />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-bg-secondary border text-black text-body-tiny font-medium rounded px-2 py-1 whitespace-nowrap z-10 shadow-sm">
        {toolTipText}
      </div>
    </div>
  );
};

export default OwnersProductItem;
