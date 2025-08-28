'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import AppHeader from './app-header';
import ComingSoonModal from '../modals/ComingSoonModal';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (

    <div className="min-h-screen bg-white flex font-inter">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={toggleSidebar}
        onToggleMobile={toggleMobileSidebar}
        currentPath={pathname}
         onShowModal={(icon) => { 
          setModalIcon(icon);
          setIsModalOpen(true);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <AppHeader
          onToggleSidebar={toggleSidebar}
          onToggleMobileSidebar={toggleMobileSidebar}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

           <ComingSoonModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={modalIcon}
        title="Coming Soon!"
      />
      </div>
    </div>
  );
}
