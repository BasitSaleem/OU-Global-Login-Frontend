"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppHeader from "../../components/layout/app-header";
import { Bell, Home, Icon } from "lucide-react";
import { Icons } from "@/components/utils/icons";
import Image from "next/image";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export default function UserProfileLayout({
  children,
}: UserProfileLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  type ImageNavItem = {
    label: string;
    href: string;
    icon: string; // ✅ path from /public
    iconType: "image";
     activeIcon?: string; // 👈 white version
    isActive: boolean;
  };

  type ComponentNavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>; // ✅ Lucide or custom component
     activeIcon?: React.ComponentType<{ className?: string }>;
    iconType: "component";
    isActive: boolean;
  };

  type NavItem = ImageNavItem | ComponentNavItem;

  const profileNavItems: NavItem[] = [
    {
      label: "Profile",
      href: "/user-profile",
      icon: Icons.home, // custom svg
      activeIcon: Icons.homewhite, // 👈 white version
      iconType: "image",
      isActive: pathname === "/user-profile",
    },
    {
      label: "Email",
      href: "/user-profile/email",
      icon: Icons.email, // custom svg
      activeIcon: Icons.emailwhite, // 👈 white version
      iconType: "image",
      isActive: pathname === "/user-profile/email",
    },
    {
      label: "Change Password",
      href: "/user-profile/change-password",
      icon: Icons.changePassword, // custom svg
       activeIcon: Icons.changePasswordwhite, // 👈 white version
      iconType: "image",
      isActive: pathname === "/user-profile/change-password",
    },
    {
      label: "Notifications",
      href: "/user-profile/notifications",
      icon: Icons.notification, // lucide-react
      iconType: "image",
      activeIcon: Icons.notificationwhite, // 👈 (replace with white bell if you have it, else fallback same)
      isActive: pathname === "/user-profile/notifications",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true); // collapsed on small screens
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white flex font-inter">
      {/* Desktop Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-12" : "w-56"
        } transition-all duration-300 bg-white border-r border-gray-200 hidden md:flex flex-col`}
      >
        {/* Logo */}
        <div
          className={`h-12 flex items-center justify-start border-b border-gray-200 ${
            sidebarCollapsed ? "px-2" : "px-3"
          }`}
        >
          <a onClick={() => router.push("/")}>
            {sidebarCollapsed ? (
              <div
                className="w-8 h-8 rounded flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#795CF5" }}
              >
                <Image
                  src={Icons.owneruniversecoll}
                  alt="Owners Universe Logo"
                  width={16}
                  height={16}
                />
              </div>
            ) : (
              <Image
                src={Icons.owneruniverse}
                width={120}
                height={120}
                alt="Owners Universe Logo"
                className="h-8 cursor-pointer "
              />
            )}{" "}
          </a>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-2">
          <div className="space-y-0.5">
            {profileNavItems.map((item) => (
              <a
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`
                  flex cursor-pointer items-center
                  ${sidebarCollapsed ? "justify-center px-0" : "px-2"}
                  py-1.5 rounded transition-colors
                  ${
                    item.isActive
                      ? "text-white"
                      : "text-[#231F20] hover:bg-gray-50"
                  }
                  gap-2
                `}
                style={item.isActive ? { backgroundColor: "#795CF5" } : {}}
                title={sidebarCollapsed ? item.label : ""}
              >
                {item.iconType === "image" ? (
                  <img src={  item.isActive && item.activeIcon ? item.activeIcon : item.icon} alt={item.label} className="w-4 h-4" />
                ) : (
                  <item.icon className="w-4 h-4 text-[#000000]" />
                )}
                {!sidebarCollapsed && (
                  <span className="text-body-medium font-medium">{item.label}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={toggleMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 flex flex-col p-2 md:hidden">
            <div className="h-12 flex items-center justify-between border-b border-gray-200 px-3">
              <div
                className="cursor-pointer"
                onClick={() => {
                  toggleMobileSidebar();
                  router.push("/");
                }}
              >
                <img
                  src="/Icons/Home.svg"
                  alt="Owners Universe Logo"
                  className="h-6"
                />
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-600 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-0.5 mt-2">
              {profileNavItems.map((item) => (
                <a
                  key={item.href}
                  onClick={() => {
                    toggleMobileSidebar();
                    router.push(item.href);
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                    item.isActive
                      ? "bg-[#795CF5] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.iconType === "image" ? (
                    <img src={item.icon} alt={item.label} className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span className="text-body-medium font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <AppHeader
          onToggleSidebar={toggleSidebar}
          onToggleMobileSidebar={toggleMobileSidebar}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
