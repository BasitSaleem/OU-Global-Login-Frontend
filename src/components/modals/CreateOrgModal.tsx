'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from './GenericModal';
import { Button, Input } from '../ui';
import { PRODUCTS } from '@/constants';
import { useCheckOrganizationNameAvailability, useCheckSubDomainAvailability } from '@/apiHooks.ts/organization/organization.api';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/hooks/useToast';
import { GlobalLoading, LoadingSpinner } from '../ui/loading';
import { CreateOrganizationData } from '@/apiHooks.ts/organization/organization.types';
import { CheckCircle, XCircle, } from 'lucide-react';

interface CreateOrgModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationData) => void;
}

interface AvailabilityStatusProps {
  isLoading: boolean;
  isAvailable?: boolean;
  isDebouncing: boolean;
  fieldName: string;
  value: string;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
  isLoading,
  isAvailable,
  isDebouncing,
  fieldName,
  value
}) => {
  if (!value) return null;

  if (isDebouncing) {
    return (
      <div className="flex items-center text-text gap-2 mt-2 text-sm">
        <LoadingSpinner size={4} className='' />
        <span>Checking {fieldName} availability...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
        <LoadingSpinner size={4} className='border-blue-600' />
        <span>Verifying {fieldName}...</span>
      </div>
    );
  }

  if (isAvailable === true) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span>{fieldName} is available</span>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
        <XCircle className="w-4 h-4" />
        <span>{fieldName} is already taken</span>
      </div>
    );
  }

  return null;
};

export default function CreateOrgModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit
}: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('OI');

  const debouncedCompanyName = useDebounce(companyName.trim(), 800);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);

  // Check if we're still debouncing
  const isNameDebouncing = companyName.trim() !== debouncedCompanyName && companyName.trim().length > 0;
  const isSubDomainDebouncing = subDomain.trim() !== debouncedSubDomain && subDomain.trim().length > 0;

  const { data: isNameAvailable, isFetching: checkingName, isError: nameError } =
    useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub, isError: subError } =
    useCheckSubDomainAvailability(selectedProduct === 'OI' ? debouncedSubDomain : '');

  // Determine if we can submit
  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProduct === 'OI' && !subDomain.trim()) return false;
    if (isNameDebouncing || checkingName) return false;
    if (selectedProduct === 'OI' && (isSubDomainDebouncing || checkingSub)) return false;
    if (isNameAvailable === false) return false;
    if (selectedProduct === 'OI' && isSubAvailable === false) return false;
    return true;
  };

  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();

    if (!trimmedName) {
      toast.error('Please enter a company name');
      return;
    }

    if (selectedProduct === 'OI' && !trimmedSubDomain) {
      toast.error('Please enter a sub-domain');
      return;
    }

    if (isNameDebouncing || checkingName) {
      toast.error('Please wait while we verify the organization name');
      return;
    }

    if (selectedProduct === 'OI' && (isSubDomainDebouncing || checkingSub)) {
      toast.error('Please wait while we verify the sub-domain');
      return;
    }

    if (isNameAvailable === false) {
      toast.error('Organization name is already taken. Please choose a different name.');
      return;
    }

    if (selectedProduct === 'OI' && isSubAvailable === false) {
      toast.error('Sub-domain is already taken. Please choose a different sub-domain.');
      return;
    }

    if (nameError) {
      toast.error('Unable to verify organization name. Please try again.');
      return;
    }

    if (selectedProduct === 'OI' && subError) {
      toast.error('Unable to verify sub-domain. Please try again.');
      return;
    }

    const payload: CreateOrganizationData = {
      name: trimmedName,
      subDomainName: trimmedSubDomain,
      product: [selectedProduct],
    };

    onSubmit(payload);
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCompanyName('');
      setSubDomain('');
      setSelectedProduct('OI');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabel="Create organization">
      {/* Overlay loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary z-50">
          <GlobalLoading />
        </div>
      )}

      <Modal.Title className="mb-2 text-heading-2">Create an Organization</Modal.Title>
      <Modal.Body>
        {/* Company Name Input */}
        <div className="mb-4">
          <Input
            label="Company Name"
            isRequired
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value.toLocaleLowerCase())}
          />
          <AvailabilityStatus
            isLoading={checkingName}
            isAvailable={isNameAvailable}
            isDebouncing={isNameDebouncing}
            fieldName="Organization name"
            value={companyName}
          />
        </div>

        {/* Product selection */}
        <label className="block text-body-small font-medium mb-2 ml-1">Products</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product.name)}
              disabled={product.isDisabled}
              className={`flex items-center gap-2 border rounded-lg px-3 py-3 text-base font-medium transition mb-1 ${selectedProduct === product.name
                ? 'border-primary bg-bg-secondary text-primary'
                : 'border text-text bg-bg-secondary hover:bg-primary/10'
                } ${product.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <img src={product.icon} alt={product.name} className="w-4 h-4" />
              {product.fullname}
            </button>
          ))}
        </div>

        {/* Subdomain input */}
        {selectedProduct === 'OI' && (
          <div className="mb-4">
            <Input
              label="Sub-Domain"
              isRequired
              value={subDomain}
              onChange={(e) => setSubDomain(e.target.value.toLocaleLowerCase())}
            />
            <AvailabilityStatus
              isLoading={checkingSub}
              isAvailable={isSubAvailable}
              isDebouncing={isSubDomainDebouncing}
              fieldName="Sub-domain"
              value={subDomain}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={onClose}
          variant="secondary"
          className="px-3"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading || !canSubmit()}
          className="px-3"
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
