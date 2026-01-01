"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfiledDropDown";
import { useAppSelector } from "@/redux/store";
import { NotificationsDropdown } from "./NotificationDropdown";
import { NotificationItemProps } from "./Header.types";
import { SvgIcon } from "@/components/ui/SvgIcon";
import Image from "next/image";
import { Button } from "@/components/ui";
interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
  collapsed: boolean;
}

export default function AppHeader({
  onToggleSidebar,
  onToggleMobileSidebar,
  mobileSidebarOpen,
  collapsed,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const toggleProfileDropdown = () => setProfileDropdownOpen((v) => !v);
  const toggleNotifications = () => setNotificationsOpen((v) => !v);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const anyUnread = notifications.some((n) => n.showDot);

  const handleMarkAllAsRead = () => {
    if (!anyUnread) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, showDot: false })));
  };

  const handleMarkOneAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, showDot: false } : n))
    );
  };

  const [err, setErr] = useState<Error | null>(null);
  if (err) {
    throw err;
  }

  const handleSettingsClick = () => {
    try {
      console.log("under development");
    } catch (e) {
      setErr(e as Error); // triggers a re-render; boundary will catch on next render
    }
  };

  const filteredNotifications = unreadOnly
    ? notifications.filter((n) => n.showDot)
    : notifications;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(collapsed, "f_______________-");

  return (
    <header className="h-14 border-b bg-bg-secondary flex items-center justify-between px-4">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <Button
          variant="basic"
          onClick={onToggleSidebar}
          className="hidden lg:flex hover:scale-105 cursor-pointer"
          title="Toggle sidebar"
        >
          <SvgIcon name={collapsed ? "hamburgerRight" : "hamburgerLeft"} className="w-5 h-5 text-icon" />
        </Button>

        <Button
          variant="basic"
          onClick={onToggleMobileSidebar}
          className="lg:hidden hover:bg-bg-secondary rounded transition-colors cursor-pointer"
        >
          {mobileSidebarOpen ? (
            <X className="w-4 h-4 text-icon" />
          ) : (
            <Menu className="w-4 h-4 text-icon" />
          )}
        </Button>

        <div className="relative flex-1 max-w-lg">
          <SvgIcon name="search" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border-0 text-body-medium  focus:outline-none focus:ring-1 focus:ring-primary bg-[#795CF512]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationsRef}>

          <Button
            // permission="og:access::notification"
            variant="basic"
            onClick={toggleNotifications}
            className="relative p-1 cursor-pointer"
            aria-label="Open notifications"
          >
            <SvgIcon name="notification" width={20} height={20} className="text-icon" />
            {/* {anyUnread && (
              <div
                className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#D1202D" }}
              />
            )} */}
          </Button>

          {notificationsOpen && (
            <NotificationsDropdown
              anyUnread={anyUnread}
              unreadOnly={unreadOnly}
              setUnreadOnly={setUnreadOnly}
              filteredNotifications={filteredNotifications}
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onMarkOneAsRead={handleMarkOneAsRead}
            />
          )}
        </div>
        <Button
          permission="og:access::setting"
          variant="basic"
          onClick={handleSettingsClick}
          className="p-1 cursor-pointer"
        >
          <SvgIcon name="settings" width={20} height={20} className="text-icon" />
        </Button>

        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition hover:scale-105 duration-300 cursor-pointer bg-primary"
            aria-label="Open profile menu"
          >
            {user?.profile_url ?
              <Image
                className="w-8 h-8 rounded-full"
                src={user?.profile_url}
                alt="profile"
                width={500}
                height={500}
              />
              : <span className="text-white  font-medium  cursor-pointer items-center">
                {" "}
                {`${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""
                  }`.toUpperCase()}
              </span>}
          </button>

          <ProfileMenu onClose={() => setProfileDropdownOpen(false)} open={profileDropdownOpen} />

        </div>
      </div>
    </header>
  );
}
