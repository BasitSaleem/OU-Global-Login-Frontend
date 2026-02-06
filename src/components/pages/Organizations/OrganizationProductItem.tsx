
import React, { useEffect, useState } from 'react'
import { generateProductLink } from './OrganizationProductCard'

import { OgOrganization, OgProduct } from '@/apiHooks.ts/organization/organization.types'
import { organizationName } from '@/utils/organizationName'
import Link from 'next/link'

interface OrganizationProductItemProps {
  product: OgProduct
  bgColor: string
  org: OgOrganization
}

const OrganizationProductItem = ({ product, bgColor, org }: OrganizationProductItemProps) => {
  // Track whether this product link should be disabled based on org creation time
  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    if (!org?.created_at) return false;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return false;

    const diffMs = Date.now() - createdAt.getTime();
    const ONE_MINUTE_MS = 60 * 1000;

    return diffMs < ONE_MINUTE_MS;
  });

  // Auto-enable after 1 minute without needing a page refresh
  useEffect(() => {
    if (!org?.created_at) return;

    const createdAt = new Date(org.created_at);
    if (isNaN(createdAt.getTime())) return;

    const ONE_MINUTE_MS = 60 * 1000;

    const updateDisabledState = () => {
      const diffMs = Date.now() - createdAt.getTime();
      if (diffMs >= ONE_MINUTE_MS) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };

    // Run immediately on mount/update
    updateDisabledState();

    const intervalId = setInterval(updateDisabledState, 1000);

    return () => clearInterval(intervalId);
  }, [org?.created_at]);

  return (
    <Link
      key={product.oi_sub_domain}
      href={generateProductLink(product.oi_sub_domain ?? '')}
      target="_blank"
      className={`group ${isDisabled ? 'pointer-events-none' : ''}`}
    >
    <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-300 cursor-pointer ${
          isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
        }`}
        style={{ backgroundColor: bgColor }}
        title={org.name}
    >
        {organizationName(org.name ?? "")} 
    </div>
</Link>
  )
}

export default OrganizationProductItem