'use client';

import Image from 'next/image';
import React from 'react';
import {Icons} from '@/components/utils/icons';

type Org = {
  id: string;
  isAddNew?: boolean;
  name?: string;
  abbreviation?: string;
  backgroundColor?: string;
  members?: number;
  teamAvatars?: string[];
};

export default function OrganizationGrid({
  organizations,
  onAddNew,
}: {
  organizations: Org[];
  onAddNew: () => void; // open CreateOrgModal
}) {
  return (
    <div>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-heading-1 font-bold text-black">Your Organizations</h1>
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-body-tiny font-medium"
            style={{ backgroundColor: '#795CF5' }}
          >
            {Math.max(0, (organizations?.length || 0) - 1)}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {organizations.map((org) => (
          <div
            key={org.id}
            onClick={() => org.isAddNew && onAddNew()}
            className={`relative group ${
              org.isAddNew ? '' : 'bg-white border border-gray-200'
            } rounded ${org.isAddNew ? '' : 'p-3'} hover:shadow-sm transition-shadow cursor-pointer`}
          >
            {org.isAddNew ? (
              /* Add New Card */
              <div
                className="flex flex-col items-center justify-center text-center h-full rounded"
                style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
              >
                <div className="mb-2">
                  <Image src={Icons.addNew} width={40} height={40} alt="Add New" />
                </div>
                <span className="text-body-medium font-medium text-primary">Add New</span>
              </div>
            ) : (
              /* Organization Card */
              <div className="flex flex-col h-full">
                {/* Top section */}
                <div className="flex items-start gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-body-small font-medium"
                    style={{ backgroundColor: org.backgroundColor }}
                  >
                    {org.abbreviation}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate text-body-medium-bold text-black leading-tight">
                      {org.name}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.04894 0.92705C7.3483 0.00573924 8.6517 0.00573965 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58779 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z"
                        fill="#795CF5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom purple section */}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-between px-2 py-1.5 rounded"
                    style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
                  >
                    <span className="text-body-small font-medium text-primary">
                      {org.members} members
                    </span>
                    <div className="flex items-center -space-x-0.5">
                      {org.teamAvatars?.map((avatarUrl, index) => (
                        <img
                          key={index}
                          src={avatarUrl}
                          alt={`Team member ${index + 1}`}
                          className="w-4 h-4 rounded-full border border-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tooltip */}
            {!org.isAddNew && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block">
                <div className="relative bg-white border border-gray-200 shadow-md rounded px-2 py-0.5 text-body-tiny text-gray-800 whitespace-nowrap">
                  {org.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-l border-t border-gray-200 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-4 flex justify-end">
        <button className="text-[#795CF5] text-body-medium font-medium hover:underline cursor-pointer">
          View More
        </button>
      </div>
    </div>
  );
}
