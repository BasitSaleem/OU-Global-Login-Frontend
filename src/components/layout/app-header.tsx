"use client";

import {  Menu, X } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import NotificationItem from "../pages/Notifications/NotificationItems";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icons } from "../utils/icons";
import { useLogout } from "@/apiHooks.ts/auth/authApi.hooks";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

type NotificationItemProps = {
  initials: string;
  color: string;
  name: string;
  action: string;
  time: string;
  showDot: boolean; // unread indicator
  title: string;
  description: string;
  updates: string;
};

/* ---------------------------------- */
/* Small inline components (same file)*/
/* ---------------------------------- */

// Controls row inside the notifications dropdown
function NotificationsControlsRow({
  anyUnread,
  onMarkAllAsRead,
  unreadOnly,
  setUnreadOnly,
}: {
  anyUnread: boolean;
  onMarkAllAsRead: () => void;
  unreadOnly: boolean;
  setUnreadOnly: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <button
        onClick={onMarkAllAsRead}
        disabled={!anyUnread}
        className={`text-body-small font-medium ${
          anyUnread ? "text-primary hover:underline cursor-pointer " : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Mark all as read
      </button>

      <div className="flex items-center gap-2">
        <span
          className="text-gray-600 text-body-small cursor-pointer hover:underline"
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          Only show unread
        </span>

        {/* Pill toggle (hidden on xs to save space) */}
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`w-12 h-6 rounded-full cursor-pointer p-1 hidden sm:flex items-center transition-colors ${
            unreadOnly ? "bg-[#795CF5]" : "bg-gray-200"
          }`}
          aria-pressed={unreadOnly}
          aria-label="Toggle only show unread"
        >
          <span
            className={`w-4 h-4 bg-white rounded-full transition-transform ${
              unreadOnly ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

// Full dropdown body (header + controls + list)
function NotificationsDropdown({
  anyUnread,
  unreadOnly,
  setUnreadOnly,
  filteredNotifications,
  notifications,
  onMarkAllAsRead,
  onMarkOneAsRead,
}: {
  anyUnread: boolean;
  unreadOnly: boolean;
  setUnreadOnly: (v: boolean) => void;
  filteredNotifications: NotificationItemProps[];
  notifications: NotificationItemProps[];
  onMarkAllAsRead: () => void;
  onMarkOneAsRead: (idx: number) => void;
}) {
  return (
    <div className="absolute -right-20 sm:right-0 top-10 w-[300px] max-[300px]:w-[200px] sm:w-[450px] md:w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h2 className="text-heading-2 font-bold text-black">Notifications</h2>
        <a
          href="/notifications"
          className="text-body-small text-primary font-medium underline hover:no-underline"
        >
          View All
        </a>
      </div>

      {/* Controls */}
      <NotificationsControlsRow
        anyUnread={anyUnread}
        onMarkAllAsRead={onMarkAllAsRead}
        unreadOnly={unreadOnly}
        setUnreadOnly={setUnreadOnly}
      />

      {/* List */}
      <div className="max-h-[600px] overflow-y-auto cursor-pointer">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            {unreadOnly ? "You're all caught up! No unread notifications." : "No notifications to show."}
          </div>
        ) : (
          filteredNotifications.map((item, index) => {
            // map index back to original list index for per-item mark-as-read
            const originalIndex = notifications.findIndex(
              (n) => n.initials === item.initials && n.time === item.time && n.title === item.title
            );
            return (
              <NotificationItem
                key={`${item.title}-${item.time}-${index}`}
                {...item}
                onMarkAsRead={() => onMarkOneAsRead(originalIndex >= 0 ? originalIndex : index)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// Profile dropdown menu
function ProfileMenu({
  onClose,
}: {
  onClose: () => void;
}) {

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        onClose();
        // Redirect to login page or homepage after logout
        router.push("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      }
    });
  };

  const router = useRouter();
  return (
    <div className="absolute -right-4 sm:right-0 top-10 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* User Info */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: "#795CF5" }}
        >
          <span className="text-white text-body-small font-medium">AR</span>
        </div>
        <div>
          <h3 className="text-body-medium-bold text-gray-900">Ali Raza</h3>
          <p className="text-body-small text-gray-500 truncate">dev.logoanimations@gmail.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-3">
        <a
          onClick={() => router.push("/user-profile")}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer"

        >
          <Image src={Icons.profile} width={14} height={14} alt="Profile" className="w-6 h-6 text-gray-600" />
          <span className="text-body-medium">Profile</span>
        </a>

        <button className="w-full flex items-center gap-2 px-0.5 py-1.5 text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer">
          <Image src={Icons.settings} width={14} height={14} alt="Settings" className="w-8 h-8 text-gray-600" />
          <span className="text-body-medium">Account settings</span>
        </button>

        <button onClick={() => handleLogout()} className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer">
          <Image src={Icons.logout} width={14} height={14} alt="Logout" className="w-6 h-6 text-gray-600" />
          <span className="text-body-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Main component                     */
/* ---------------------------------- */

export default function AppHeader({
  onToggleSidebar,
  onToggleMobileSidebar,
  mobileSidebarOpen,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter();

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const toggleProfileDropdown = () => setProfileDropdownOpen((v) => !v);
  const toggleNotifications = () => setNotificationsOpen((v) => !v);

  // Notifications in state
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([
    { initials: "BS", color: "#137F6A", name: "Basit Saleem", action: "updated a page", time: "Just now",    showDot: true,  title: "Owners AI Bot",     description: "RS-Owners-Inventory",    updates: "+3 updates from Basit Saleem" },
    { initials: "JS", color: "#B11E67", name: "John Smith",   action: "updated a page", time: "2 mins ago",  showDot: true,  title: "Editors AI Bot",     description: "RS-Editors-Inventory",    updates: "+2 updates from John Smith" },
    { initials: "AS", color: "#1AD1B9", name: "Alice Sanders",action: "updated a page", time: "1 day ago",   showDot: false, title: "Managers AI Bot",    description: "RS-Managers-Inventory",  updates: "+1 update from Alice Sanders" },
    { initials: "TH", color: "#FF7C3B", name: "Tom Hanks",    action: "updated a page", time: "1 week ago",  showDot: false, title: "Admins AI Bot",      description: "RS-Admins-Inventory",    updates: "+5 updates from Tom Hanks" },
    { initials: "DS", color: "#F95C5B", name: "David Smith",  action: "updated a page", time: "2 weeks ago", showDot: true,  title: "Supervisors AI Bot", description: "RS-Supervisors-Inventory", updates: "+4 updates from David Smith" },
  ]);

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
   // ⬇️ IMPORTANT: if we have an error, throw it during render so the boundary catches it
  if (err) {
    throw err;
  }

  // ⬇️ CHANGE THIS: don’t throw in the event handler
  const handleSettingsClick = () => {    
    try {
      // whatever risky work...
      throw new Error('Settings page is under development');
    } catch (e) {
      setErr(e as Error); // triggers a re-render; boundary will catch on next render
    }
  };

  const filteredNotifications = unreadOnly
    ? notifications.filter((n) => n.showDot)
    : notifications;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Desktop Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <Image src={Icons.hamburgerCompress} width={14} height={14} alt="Menu" className="w-5 h-5 text-gray-600" />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4 text-gray-600" /> : <Menu className="w-4 h-4 text-gray-600" />}
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Image src={Icons.search} alt="Search" width={16} height={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 rounded border-0 text-body-medium placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#795CF5]"
            style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer"
            aria-label="Open notifications"
          >
            <Image src={Icons.notification} width={16} height={16} alt='notifications' className="w-6 h-6 text-gray-600" />
            {anyUnread && (
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#D1202D" }} />
            )}
          </button>

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

        {/* Settings */}
        <button onClick={handleSettingsClick} className="p-1 hover:bg-gray-50 rounded cursor-pointer">
          <Image src={Icons.settings} width={16} height={16} alt="Settings" className="w-8 h-8 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#795CF5" }}
            aria-label="Open profile menu"
          >
            <span className="text-white text-body-small font-medium">AR</span>
          </button>

          {profileDropdownOpen && <ProfileMenu onClose={() => setProfileDropdownOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
