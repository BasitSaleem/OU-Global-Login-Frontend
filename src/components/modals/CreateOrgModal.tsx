'use client';

import { X } from "lucide-react";
import React, { useState } from "react";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { companyName: string; subDomain: string; product: string }) => void;
}

export default function CreateOrgModal({ isOpen, onClose, onSubmit }: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  if (!isOpen) return null;

  const products = [
    { id: "inventory", name: "Owners Inventory", icon: "https://api.builder.io/api/v1/image/assets/TEMP/3c4327f1dd595491744f2af966536dd987ec0a0a?width=66" },
    { id: "marketplace", name: "Owners Marketplace", icon: "https://api.builder.io/api/v1/image/assets/TEMP/df8a47bf275bccdb600fe4495f3d4bead9cb844f?width=64" },
    { id: "analytics", name: "Owners Analytics", icon: "https://api.builder.io/api/v1/image/assets/TEMP/72b1ea421112224fa1bea68adcd733be5aa8666b?width=76" },
    { id: "jungle", name: "Owners Jungle", icon: "https://api.builder.io/api/v1/image/assets/TEMP/78407e1c15d2b695844d30eed5f5358ca8da09f8?width=64" },
  ];

  const handleSubmit = () => {
    if (companyName && subDomain && selectedProduct) {
      onSubmit({ companyName, subDomain, product: selectedProduct });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg relative w-[550px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer bg-[#795CF512] rounded-2xl p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-4">Create an Organization</h2>

        {/* Company Name */}
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#795CF5]"
        />

        {/* Products */}
        <label className="block text-sm font-medium mb-2">Products</label>
        <div className="grid grid-cols-2 gap-1 sm:gap-3 mb-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product.name)}
              className={`flex items-center gap-2 border rounded-lg px-2 py-2 text-sm font-medium  cursor-pointer ${
                selectedProduct === product.name
                  ? "border-[#795CF5] bg-[#795CF512] text-[#795CF5]"
                  : "border-gray-200 text-gray-700 bg-gray-100"
              }`}
            >
              <img src={product.icon} alt={product.name} className="w-5 h-5" />
              {product.name}
            </button>
          ))}
        </div>

        {/* Sub-Domain */}
        <div className="flex items-center gap-2 mb-1">
  <label className="block text-sm font-medium">Sub-Domain Name</label>
  <div className="relative group">
    <span className="cursor-pointer text-white hover:text-[#795CF5] bg-gray-500 rounded-xl px-2">
      i
    </span>
    {/* Tooltip */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
      <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap">
        Sub-domain is for Owners Inventory only
      </div>
    </div>
  </div>
</div>
        <input
          type="text"
          value={subDomain}
          onChange={(e) => setSubDomain(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#795CF5]"
        />

        {/* Footer buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-white cursor-pointer"
            style={{ backgroundColor: "#795CF5" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
