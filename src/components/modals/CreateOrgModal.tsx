'use client';

import React, { use, useEffect, useState } from 'react';
import { Modal } from './GenericModal';
import { Button, Input, LoadingSpinner } from '../ui';
import { PRODUCTS } from '@/constants';
import { useCheckOrganizationNameAvailability, useCheckSubDomainAvailability, useCreateOrganization, useGetOrganizations } from '@/apiHooks.ts/organization/organization.api';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/hooks/useToast';
import { GlobalLoading } from '../ui/loading';
interface CreateOrgModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { companyName: string; subDomain: string; product: string }) => void;
}


export default function CreateOrgModal({ isOpen, onClose, isLoading }: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('OI');
  const [createdOrg, setCreatedPOrg] = useState()

  const debouncedCompanyName = useDebounce(companyName, 2000);
  const debouncedSubDomain = useDebounce(subDomain, 2000);

  const { mutate: createOrg, isPending: creatingOrg } = useCreateOrganization();
  const { refetch } = useGetOrganizations(10, 10);

  const { data: isNameAvailable, isFetching: checkingName } =
    useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub } =
    useCheckSubDomainAvailability(selectedProduct === "OI" ? debouncedSubDomain : "");

  const handleSubmit = () => {
    if (!companyName || (selectedProduct === "OI" && !subDomain)) return;

    if (isNameAvailable === false) {
      toast.error("Organization name is already taken");
      return;
    }
    if (selectedProduct === "OI" && isSubAvailable === false) {
      toast.error("Subdomain is already taken");
      return;
    }

    const payload = {
      name: companyName,
      subDomainName: subDomain,
      product: [selectedProduct],
    };

    createOrg(payload, {
      onSuccess: (data) => {
        setCreatedPOrg(data.organization)
        refetch();    // latest org fetch
        onClose();    // modal close
      },
    });
  };
  console.log("Creating org", creatingOrg);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabel="Create organization">


      {/* Loader overlay */}
      {creatingOrg && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-50">
          <GlobalLoading />
        </div>
      )}

      <Modal.Title className="mb-2 text-heading-2">Create an Organization</Modal.Title>
      <Modal.Body>
        <Input
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={checkingName && !isNameAvailable ? "Name is taken" : ""}
          className="w-full border rounded px-2 py-1.5 mb-2 text-body-medium focus:outline-none focus:ring-1 focus:ring-[#795CF5]"
        />
        {companyName && (
          <p className="text-sm mt-1">
            {debouncedCompanyName !== companyName
              ? "Checking availability..."
              : isNameAvailable
                ? " Name available"
                : " Name already taken"}
          </p>
        )}

        {/* Products */}
        <label className="block text-body-small font-medium mb-1">Products</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product.name)}
              disabled={product.isDisabled}
              className={`flex items-center gap-2 border rounded-lg px-3 py-3 text-base font-medium transition ${selectedProduct === product.name
                ? "border-[#795CF5] bg-[#795CF512] text-[#795CF5]"
                : "border-gray-200 text-gray-700 bg-gray-100 hover:bg-gray-200"
                } ${product.isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <img src={product.icon} alt={product.name} className="w-4 h-4" />
              {product.fullname}
            </button>
          ))}
        </div>

        <Input
          label="Sub-Domain"
          value={subDomain}
          onChange={(e) => setSubDomain(e.target.value)}
          error={checkingSub && !isSubAvailable ? "Subdomain is taken" : ""}
          className="w-full border rounded px-2 py-1.5 mb-1.5 text-body-medium focus:outline-none focus:ring-1 focus:ring-[#795CF5]"
        />
        {selectedProduct === "OI" && subDomain && (
          <p className="text-sm mt-1">
            {debouncedSubDomain !== subDomain
              ? "Checking availability..."
              : isSubAvailable
                ? "Sub-domain available"
                : "Sub-domain already taken"}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={isLoading}
          onClick={onClose}
          variant='primary'
          className="px-3 py-1.5 rounded border border-[#795CF5] text-[#795CF5] text-body-small hover:bg-[#795CF507] cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={creatingOrg}
          className="px-3 py-1.5 rounded text-white text-body-small cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]"
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
