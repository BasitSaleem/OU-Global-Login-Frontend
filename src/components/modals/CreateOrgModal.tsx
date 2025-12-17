'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Modal } from './GenericModal';
import { Button, Input } from '../ui';
import { PRODUCTS } from '@/constants';
import { useCheckOrganizationNameAvailability, useCheckSubDomainAvailability } from '@/apiHooks.ts/organization/organization.api';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateOrganizationData } from '@/apiHooks.ts/organization/organization.types';
import { generateSubdomainSuggestions } from '@/utils/subdomainGenerator';
import { SubdomainSuggestion } from '../SubdomainSuggestion';
import { AvailabilityStatus } from '../AvailabilityStatus';
import { SvgIcon } from '../ui/SvgIcon';

interface CreateOrgModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationData) => void;
}

export default function CreateOrgModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit
}: CreateOrgModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('OI');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const debouncedCompanyName = useDebounce(companyName.trim(), 800);
  const debouncedSubDomain = useDebounce(subDomain.trim(), 800);
  const isNameDebouncing = companyName.trim() !== debouncedCompanyName && companyName.trim().length > 0;
  const isSubDomainDebouncing = subDomain.trim() !== debouncedSubDomain && subDomain.trim().length > 0;

  // const { data: isNameAvailable, isFetching: checkingName, isError: nameError } =
  //   useCheckOrganizationNameAvailability(debouncedCompanyName);

  const { data: isSubAvailable, isFetching: checkingSub, isError: subError } =
    useCheckSubDomainAvailability(selectedProduct === 'OI' ? debouncedSubDomain : '');

  const subdomainSuggestions = useMemo(() => {
    if (!companyName.trim() || companyName.trim().length < 2) return [];
    return generateSubdomainSuggestions(companyName);
  }, [companyName]);

  // useEffect(() => {
  //   if (subDomain === '' && subdomainSuggestions.length > 0 && selectedProduct === 'OI') {
  //     setSubDomain(subdomainSuggestions[0]);
  //   }
  // }, [subdomainSuggestions, subDomain, selectedProduct]);

  useEffect(() => {
    if (companyName.trim().length > 1) {
      setIsGeneratingSuggestions(true);
      const timer = setTimeout(() => {
        setIsGeneratingSuggestions(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setIsGeneratingSuggestions(false);
    }
  }, [companyName]);

  const handleSuggestionClick = (suggestion: string) => {
    setSubDomain(suggestion);
  };

  const canSubmit = () => {
    if (!companyName.trim()) return false;
    if (selectedProduct === 'OI' && !subDomain.trim()) return false;
    // if (isNameDebouncing || checkingName) return false;
    if (selectedProduct === 'OI' && (isSubDomainDebouncing || checkingSub)) return false;
    // if (isNameAvailable === false) return false;
    if (selectedProduct === 'OI' && isSubAvailable === false) return false;
    return true;
  };

  const handleSubmit = () => {
    const trimmedName = companyName.trim();
    const trimmedSubDomain = subDomain.trim();
    const payload: CreateOrganizationData = {
      name: trimmedName,
      subDomainName: trimmedSubDomain,
      product: [selectedProduct],
    };

    onSubmit(payload);
  };

  useEffect(() => {
    if (!isOpen) {
      setCompanyName('');
      setSubDomain('');
      setSelectedProduct('OI');
      setIsGeneratingSuggestions(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabel="Create organization">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-bg-secondary rounded-xl shadow-xl w-full max-w-xl mx-4 border animate-pulse">
            <div className="p-4 ">
              <div className="h-8 bg-skeleton rounded-lg w-56"></div>
            </div>
            <div className="p-4">
              <div className="mb-6">
                <div className="h-10 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-3"
                    >
                      <div className="w-6 h-6 bg-skeleton rounded-full"></div>
                      <div className="h-4 bg-skeleton rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <div className="h-12 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3 w-full justify-end">
                <div className="h-10 bg-skeleton rounded-lg w-24"></div>
                <div className="h-10 bg-skeleton rounded-lg w-24"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal.Title className="mb-2 text-heading-2">Create an Organization</Modal.Title>
      <Modal.Body>
        <div className="mb-4">
          <Input
            label="Company Name"
            isRequired
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          {/* <AvailabilityStatus
            isLoading={checkingName}
            isAvailable={isNameAvailable}
            isDebouncing={isNameDebouncing}
            fieldName="Organization name"
            value={companyName}
            companyName={true}
          /> */}
        </div>

        <label className="block text-body-small font-medium mb-2 ml-1">Products</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.name)}
              disabled={product.isDisabled}
              className={`flex items-center gap-2 border  justify-start  rounded-lg px-3 py-3 text-base font-medium transition mb-1 ${selectedProduct === product.name
                ? 'border-primary bg-bg-secondary text-primary'
                : 'border text-text bg-bg-secondary hover:bg-primary/10'
                } ${product.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${product.isDisabled ? "bg-primary/10" : ""}
                `}
            >
              <SvgIcon name={product.icon} width={16} height={16} />
              {product.fullname}
            </button>
          ))}
        </div>

        {selectedProduct === 'OI' && (
          <div className="mb-4">
            <Input
              label="Sub-Domain"
              isRequired
              value={subDomain}
              onChange={(e) =>
                setSubDomain(
                  e.target.value
                    .toLocaleLowerCase()
                    .trim()
                    .replace(/[^a-z0-9-]/g, "")
                )
              } />
            <AvailabilityStatus
              isLoading={checkingSub}
              isAvailable={isSubAvailable}
              isDebouncing={isSubDomainDebouncing}
              fieldName="Sub-domain"
              value={subDomain}
            />
            {companyName.trim().length > 1 && (
              <SubdomainSuggestion
                suggestions={subdomainSuggestions}
                onSuggestionClick={handleSuggestionClick}
                isLoading={isGeneratingSuggestions}
              />
            )}


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
          variant='primary'
          isLoading={isLoading}
          disabled={isLoading || !canSubmit()}
          className='text-white'
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}