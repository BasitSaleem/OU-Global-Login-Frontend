import { SvgIcon } from "@/components/ui/SvgIcon";
import React from "react";

const InvoiceModalHeader = () => {
  return (
    <div className="bg-[#8B5CF6] -m-6 p-8 text-white flex justify-between items-start">
      <div>
        <div className="mb-6 items-center justify-center h-18 w-18 flex rounded-md bg-white">
          <SvgIcon name="OI" height={60} width={60} />
        </div>
        <h1 className="text-3xl font-bold">Thanks For your Subscription</h1>
      </div>
      <div className="text-right space-y-1 opacity-90 text-sm">
        <p className="font-bold text-base">Owners Inventory LLC</p>
        <p>support@ownersinventory.com</p>
        <p>www.ownersinventory.com</p>
      </div>
    </div>
  );
};

export default InvoiceModalHeader;
