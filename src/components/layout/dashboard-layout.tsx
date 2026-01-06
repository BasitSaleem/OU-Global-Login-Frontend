'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AppHeader from './Header/Header';
import ComingSoonModal from '../modals/ComingSoonModal';
import { AuthGuard } from '../HOCs/auth-guard';
import { GlobalLoading } from '../ui/loading';


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
    <AuthGuard fallback={<GlobalLoading text='Authenticating' />}>

      <div className="min-h-screen bg-background flex font-inter">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggleMobile={toggleMobileSidebar}
          currentPath={pathname}
          onShowModal={(icon) => {
            setIsModalOpen(true);
            setModalIcon(icon);
          }}
        />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <AppHeader
            onToggleSidebar={toggleSidebar}
            onToggleMobileSidebar={toggleMobileSidebar}
            mobileSidebarOpen={mobileSidebarOpen}
            collapsed={sidebarCollapsed}
          />

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
    </AuthGuard>
  );
}
