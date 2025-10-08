'use client';

import React, { useState } from 'react';
import { Modal } from './GenericModal';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { companyName: string; subDomain: string; product: string }) => void;
}

export default function CreateOrgModal({ isOpen, onClose, onSubmit }: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Owners Inventory');

  const products = [
    { id: 'inventory', name: 'Owners Inventory', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/3c4327f1dd595491744f2af966536dd987ec0a0a?width=66' },
    { id: 'marketplace', name: 'Owners Marketplace', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/df8a47bf275bccdb600fe4495f3d4bead9cb844f?width=64' },
    { id: 'analytics', name: 'Owners Analytics', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/72b1ea421112224fa1bea68adcd733be5aa8666b?width=76' },
    { id: 'jungle', name: 'Owners Jungle', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/78407e1c15d2b695844d30eed5f5358ca8da09f8?width=64' },
  ];

  const handleSubmit = () => {
    if (companyName && subDomain && selectedProduct) {
      onSubmit({ companyName, subDomain, product: selectedProduct });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabel="Create organization">
      <Modal.Title className="mb-2 text-heading-2 dark:!text-white">Create an Organization</Modal.Title>

      <Modal.Body>
        {/* Company Name */}
        <label className="block text-body-small font-medium mb-1 dark:!text-white">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded dark:bg-gray-700 dark:border-gray-600 px-2 py-1.5 mb-2 text-body-medium focus:outline-none focus:ring-1 focus:ring-[#795CF5]"
        />

        {/* Products */}
        <label className="block text-body-small font-medium mb-1.5 dark:!text-white mt-2 ">Products</label>
        <div className="grid grid-cols-2 gap-2  mb-2">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product.name)}
              className={`flex items-center gap-1.5 border rounded px-1.5 py-1.5 text-body-small font-medium cursor-pointer ${selectedProduct === product.name
                ? 'border-[#795CF5] bg-[#795CF512] text-[#795CF5]'
                : 'border-gray-200 text-gray-700 bg-gray-100'
                }`}
            >
              <img src={product.icon} alt={product.name} className="w-4 h-4" />
              {product.name}
            </button>
          ))}
        </div>

        {/* Sub-Domain */}
        <div className="flex items-center gap-1.5 mb-2 mt-2">
          <label className="block text-body-small font-medium dark:!text-white">Sub-Domain Name</label>
          <div className="relative group">
            <span className="cursor-pointer text-white hover:text-[#795CF5] bg-gray-500 rounded-full w-4 h-4 flex items-center justify-center text-body-tiny">
              i
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block">
              <div className="bg-gray-800 text-white text-body-tiny rounded py-0.5 px-1.5 shadow-lg whitespace-nowrap">
                Sub-domain is for Owners Inventory only
              </div>
            </div>
          </div>
        </div>

        <input
          type="text"
          value={subDomain}
          onChange={(e) => setSubDomain(e.target.value)}
          className="w-full border rounded dark:bg-gray-700 dark:border-gray-600 px-2 py-1.5 mb-1.5 text-body-medium focus:outline-none focus:ring-1 focus:ring-[#795CF5]"
        />
      </Modal.Body>

      <Modal.Footer>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded border border-[#795CF5] text-[#795CF5] text-body-small hover:bg-[#795CF507] cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 rounded text-white text-body-small cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]"
        >
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
}
