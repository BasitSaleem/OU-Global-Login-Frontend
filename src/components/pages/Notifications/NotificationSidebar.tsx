'use client';
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
        className={`fixed inset-y-0 left-0 z-40 w-[281px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Mobile close header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden bg-white">
          <h1 className="text-xl font-bold">Notifications</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-black">
            <HiX size={24} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="p-8 pb-10 overflow-y-auto">
          <h1 className="text-2xl font-bold text-black mb-6 hidden md:block">Notifications</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {sidebarFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveSidebarFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-base transition-colors cursor-pointer ${
                  activeSidebarFilter === filter.id ? 'text-primary' : 'text-black hover:bg-gray-50'
                }`}
                style={
                  activeSidebarFilter === filter.id
                    ? { backgroundColor: '#795CF512', color: '#795CF5' }
                    : {}
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-base font-medium text-black mb-2">PRODUCTS</h3>
            <div className="space-y-1">
              {productFilters.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setActiveProductFilter(product.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base transition-colors cursor-pointer ${
                    activeProductFilter === product.id ? 'text-primary' : 'text-black hover:bg-gray-50'
                  }`}
                  style={
                    activeProductFilter === product.id
                      ? { backgroundColor: '#795CF512', color: '#795CF5' }
                      : {}
                  }
                >
                  {product.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
