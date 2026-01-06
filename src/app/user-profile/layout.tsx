"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppHeader from "../../components/layout/Header/Header";
import { Icons } from "@/components/utils/icons";
import { IconName, SvgIcon } from "@/components/ui/SvgIcon";
import Link from "next/link";

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
    icon: IconName
    activeIcon?: string;
    isActive: boolean;
  };

  type ComponentNavItem = {
    label: string;
    href: string;
    icon: IconName
    activeIcon?: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  };

  type NavItem = ImageNavItem | ComponentNavItem;

  const profileNavItems: NavItem[] = [
    {
      label: "Profile",
      href: "/user-profile",
      icon: "home", // custom svg
      activeIcon: Icons.homewhite,
      isActive: pathname === "/user-profile",
    },
    {
      label: "Email",
      href: "/user-profile/email",
      icon: "email",
      activeIcon: Icons.emailwhite,
      isActive: pathname === "/user-profile/email",
    },
    {
      label: "Change Password",
      href: "/user-profile/change-password",
      icon: "changePassword",
      activeIcon: Icons.changePasswordwhite,
      isActive: pathname === "/user-profile/change-password",
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
    <div className="min-h-screen bg-background flex font-inter">
      {/* Desktop Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-17" : "w-70"
          } transition-all duration-300 bg-bg-secondary border-r  hidden md:flex flex-col`}
      >
        {/* Logo */}
        <div
          className={`h-14 flex items-center justify-start border-b  ${sidebarCollapsed ? "px-4" : "px-3"
            }`}
        >
          <a onClick={() => router.push("/")}>
            {sidebarCollapsed ? (
              <div
                className="w-8 h-8 rounded-lg flex items-center  justify-center cursor-pointer bg-primary"
              >
                <SvgIcon name="ownersUniverseColl" className=" w-[16px] h-[16px]" />

              </div>
            ) : (
              <SvgIcon
                name="ownersUniverse"
                className="text-foreground cursor-pointer"
                width={130}
                height={130}
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
                  flex cursor-pointer items-center hover:text-primary
                  ${sidebarCollapsed ? "justify-center px-0" : "px-2"}
                  py-2 rounded-lg transition-colors
                  ${item.isActive
                    ? "text-white bg-primary hover:bg-primary hover:text-white"
                    : "hover:bg-primary/10 "
                  }
                  gap-2
                `}
                title={sidebarCollapsed ? item.label : ""}
              >

                <SvgIcon name={item.icon} width={20} height={20} className={`text-icon ${item.isActive ? "text-white" : ""}`} />
                {!sidebarCollapsed && (
                  <span className=" font-medium">{item.label}</span>
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
          <div className="fixed inset-y-0 left-0 z-40 w-56 bg-bg-secondary border-r  flex flex-col p-2 md:hidden">
            <div className="h-12 flex items-center justify-between border-b  px-3">
              <div
                className="cursor-pointer"
                onClick={() => {
                  toggleMobileSidebar();
                  router.push("/");
                }}
              >
                <SvgIcon
                  name="ownersUniverse"
                  className="text-foreground"
                  width={130}
                  height={130}
                />
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-0.5 mt-2">
              {profileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    toggleMobileSidebar();
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded transition-colors hover:bg-primary/80 ${item.isActive
                    ? "bg-primary"
                    : ""
                    }`}
                >
                  <SvgIcon name={item.icon} className="w-6 h-6 " />
                  <span className="text-body-medium font-medium">{item.label}</span>
                </Link>
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
          collapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
