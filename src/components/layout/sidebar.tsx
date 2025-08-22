'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  ChevronRight,
  Clock,
  ExternalLink,
  Home,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
  currentPath?: string;
}

export default function Sidebar({ 
  collapsed, 
  mobileOpen, 
  onToggleCollapse, 
  onToggleMobile,
  currentPath = '/'
}: SidebarProps) {
  
  const navigationItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      isActive: currentPath === '/'
    },
    {
      href: '/organizations',
      icon: Building2,
      label: 'Organizations',
      isActive: currentPath === '/organizations'
    },
    {
      href: '/inventory',
      icon: 'image',
      label: 'Inventory',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/3c4327f1dd595491744f2af966536dd987ec0a0a?width=66',
      hasExternal: true,
      isActive: currentPath === '/inventory'
    },
    {
      href: '/marketplace',
      icon: 'image',
      label: 'Marketplace',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/df8a47bf275bccdb600fe4495f3d4bead9cb844f?width=64',
      hasTime: true,
      isActive: currentPath === '/marketplace'
    },
    {
      href: '/jungle',
      icon: 'image',
      label: 'Jungle',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/78407e1c15d2b695844d30eed5f5358ca8da09f8?width=64',
      hasTime: true,
      isActive: currentPath === '/jungle'
    },
    {
      href: '/analytics',
      icon: 'image',
      label: 'Analytics',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/be8931ee53da43e803d3d1a1fddbcc1f9187aaa2?width=64',
      hasBadge: true,
      isActive: currentPath === '/analytics'
    }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${collapsed ? 'w-20' : 'w-72'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out
        fixed lg:relative inset-y-0 left-0 z-50 bg-white
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200">
          {collapsed ? (
            <div className="w-9 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#795CF5' }}>
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/c9c33312a3f9aa13e72013d867e81317b276f1fc?width=70" 
                alt="Logo" 
                className="w-6 h-6"
              />
            </div>
          ) : (
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/0b766862203ee432b826ab8db2da20484b953ac7?width=384" 
              alt="Owners Universe Logo" 
              className="h-8"
            />
          )}
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`
                flex items-center 
                ${collapsed ? 'justify-center px-0' : 'px-3'} 
                py-3 rounded-lg transition-colors
                ${item.isActive 
                  ? 'text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${!collapsed && !item.isActive ? 'gap-3' : ''}
                ${!collapsed && (item.hasExternal || item.hasTime || item.hasBadge) ? 'justify-between' : ''}
              `}
              style={item.isActive ? { backgroundColor: '#795CF5' } : {}}
              title={collapsed ? item.label : ''}
            >
              {collapsed ? (
                // Collapsed view - show only icon/image
                item.icon === 'image' ? (
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-8 h-8"
                  />
                ) : (
                  <item.icon className="w-5 h-5" />
                )
              ) : (
                // Expanded view
                <>
                  <div className="flex items-center gap-3">
                    {item.icon === 'image' ? (
                      <img 
                        src={item.image} 
                        alt={item.label} 
                        className="w-8 h-8"
                      />
                    ) : (
                      <item.icon className="w-5 h-5" />
                    )}
                    <span className={`text-base ${item.isActive ? 'font-medium' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Right side icons/badges */}
                  {item.hasExternal && <ExternalLink className="w-4 h-4" />}
                  {item.hasTime && <Clock className="w-4 h-4" />}
                  {item.hasBadge && !item.isActive && (
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full" 
                      style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)', color: '#795CF5' }}
                    >
                      TRY
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
          
          {/* View All Products Grid Icon - appears right after Analytics when collapsed */}
          {collapsed && (
            <div className="px-3 mt-1">
              <a
                href="/view-all-product"
                className={`
                  flex items-center justify-center w-12 h-13 mx-auto rounded-lg border-t transition-all
                  ${currentPath === '/view-all-product'
                    ? 'border-white shadow-md'
                    : 'border-white hover:shadow-sm'
                  }
                `}
                style={{ backgroundColor: '#795CF5' }}
                title="View All Products"
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4.15625C4 3.56082 4.21052 3.05259 4.63155 2.63155C5.05258 2.21052 5.56082 2 6.15625 2H8.3125C8.90793 2 9.41616 2.21052 9.8372 2.63155C10.2582 3.05259 10.4687 3.56082 10.4687 4.15625V6.3125C10.4687 6.90793 10.2582 7.41617 9.8372 7.8372C9.41616 8.25823 8.90793 8.46875 8.3125 8.46875H6.15625C5.56082 8.46875 5.05259 8.25823 4.63155 7.8372C4.21052 7.41616 4 6.90793 4 6.3125V4.15625ZM4 13.5C4 12.9046 4.21052 12.3963 4.63155 11.9753C5.05258 11.5543 5.56082 11.3437 6.15625 11.3437H8.3125C8.90793 11.3437 9.41616 11.5543 9.8372 11.9753C10.2582 12.3963 10.4687 12.9046 10.4687 13.5V15.6562C10.4687 16.2517 10.2582 16.7599 9.8372 17.1809C9.41616 17.602 8.90793 17.8125 8.3125 17.8125H6.15625C5.56082 17.8125 5.05258 17.602 4.63155 17.1809C4.21052 16.7599 4 16.2517 4 15.6562V13.5ZM13.3437 4.15625C13.3437 3.56082 13.5543 3.05259 13.9753 2.63155C14.3963 2.21052 14.9046 2 15.5 2H17.6562C18.2517 2 18.7599 2.21052 19.1809 2.63155C19.602 3.05258 19.8125 3.56082 19.8125 4.15625V6.3125C19.8125 6.90793 19.602 7.41616 19.1809 7.8372C18.7599 8.25823 18.2517 8.46875 17.6562 8.46875H15.5C14.9046 8.46875 14.3963 8.25823 13.9753 7.8372C13.5543 7.41616 13.3437 6.90793 13.3437 6.3125V4.15625ZM13.3437 13.5C13.3437 12.9046 13.5543 12.3963 13.9753 11.9753C14.3963 11.5543 14.9046 11.3437 15.5 11.3437H17.6562C18.2517 11.3437 18.7599 11.5543 19.1809 11.9753C19.602 12.3963 19.8125 12.9046 19.8125 13.5V15.6562C19.8125 16.2517 19.602 16.7599 19.1809 17.1809C18.7599 17.602 18.2517 17.8125 17.6562 17.8125H15.5C14.9046 17.8125 14.3963 17.602 13.9753 17.1809C13.5543 16.7599 13.3437 16.2517 13.3437 15.6562V13.5Z" stroke="white" strokeWidth="1.25" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          )}
        </nav>
        
        {/* View All Products - Full section when expanded */}
        {!collapsed && (
          <div className="px-3 mt-8 pt-6 border-t border-gray-200">
            <a
              href="/view-all-product"
              className={`
                flex items-center justify-between w-full px-3 py-4 rounded-lg transition-colors
                ${currentPath === '/view-all-product'
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
              style={currentPath === '/view-all-product' ? { backgroundColor: '#795CF5' } : {}}
            >
              <span className="text-base font-medium">View All Products</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
