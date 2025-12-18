'use client';
import { Button } from '@/components/ui';
import React from 'react';
import { HiX } from 'react-icons/hi';

type SidebarFilter = { id: string; label: string };
type ProductFilter = { id: string; label: string };

export default function NotificationsSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarFilters,
  activeSidebarFilter,
  setActiveSidebarFilter,
  productFilters,
  activeProductFilter,
  setActiveProductFilter,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarFilters: SidebarFilter[];
  activeSidebarFilter: string;
  setActiveSidebarFilter: (id: string) => void;
  productFilters: ProductFilter[];
  activeProductFilter: string;
  setActiveProductFilter: (id: string) => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[402px] bg-background border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Mobile close header */}
        <div className="p-2 border-b  flex items-center justify-between md:hidden bg-background ">
          <h1 className="text-heading-2 font-bold">Notifications</h1>
          <button onClick={() => setSidebarOpen(false)} className=" cursor-pointer hover:text-black ">
            <HiX size={16} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="p-3 pb-4 overflow-y-auto">
          <h1 className="text-heading-1 font-bold text-black mb-3 hidden md:block">Notifications</h1>

          {/* Filter Tabs */}
          <div className="flex gap-1 mb-3">
            {sidebarFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeSidebarFilter === filter.id ? 'primary' : 'basic'}
                onClick={() => setActiveSidebarFilter(filter.id)}
                className={`h-8 bg-background hover:bg-primary/10 ${activeSidebarFilter === filter.id ? "text-primary bg-primary/10" : ''}  `}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-body-small] font-medium text-black mb-2">PRODUCTS</h3>
            <div className="space-y-1">
              {productFilters.map((product) => (
                <Button
                  key={product.id}
                  onClick={() => setActiveProductFilter(product.id)}
                  variant={activeProductFilter === product.id ? 'primary' : 'basic'}
                  className={`w-full justify-start h-10 bg-background hover:bg-primary/10 ${activeProductFilter === product.id ? "text-primary bg-primary/10" : ''}`}
                >
                  {product.label}
                </Button>

              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/70 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
