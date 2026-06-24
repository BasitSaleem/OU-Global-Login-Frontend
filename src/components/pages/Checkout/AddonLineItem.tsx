import React from "react";

type LineItemType = {
  description: string;
  amount: number;
  period: { start: number; end: number };
};

type PreviewDataType = {
  chargeToday: string;
  renewalTotal: string;
  renewalDate: string;
  currency: string;
  breakdown: LineItemType[];
};

type AddonLineItemProps = {
  previewData: PreviewDataType;
};

const AddonLineItem = ({ previewData }: AddonLineItemProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-primary/5 border-b">
        <span className="text-xs font-semibold text-text uppercase tracking-wider">
          Line items
        </span>
      </div>
      <div className="divide-y">
        {previewData.breakdown.map((line: LineItemType, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <span className="text-text flex-1 pr-4 leading-snug">
              {line.description}
            </span>
            <span
              className={`font-medium shrink-0 ${line.amount < 0 ? "text-green-600" : ""}`}
            >
              {line.amount < 0 ? "−" : ""}
              {/* {previewData.currency?.toUpperCase() ?? "USD"} */}$
              {Math.abs(line.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddonLineItem;
