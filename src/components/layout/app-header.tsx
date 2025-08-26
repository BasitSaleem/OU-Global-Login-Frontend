"use client";

import { Bell, LogOut, Menu, Search, Settings, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationItem from "../pages/Notifications/NotificationItems";

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
function ControlsRow({
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
    <div className="flex items-center justify-between px-6 py-4">
      <button
        onClick={onMarkAllAsRead}
        disabled={!anyUnread}
        className={`text-xs sm:text-base font-medium ${
          anyUnread ? "text-primary hover:underline" : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Mark all as read
      </button>

      <div className="flex items-center gap-2">
        <span
          className="text-gray-600 text-xs sm:text-base cursor-pointer hover:underline"
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          Only show unread
        </span>

        {/* Pill toggle (hidden on xs to save space) */}
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`w-12 h-6 rounded-full p-1 hidden sm:flex items-center transition-colors ${
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
    <div className="absolute -right-32 sm:right-0 top-12 w-[300px] sm:w-[500px] md:w-[600px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[755px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-sm sm:text-2xl font-bold text-black">Notifications</h2>
        <a
          href="/notifications"
          className="text-sm text-primary sm:text-base font-medium underline hover:no-underline"
        >
          View All
        </a>
      </div>

      {/* Controls */}
      <ControlsRow
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
  return (
    <div className="absolute -right-4 sm:right-0 top-12 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      {/* User Info */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: "#795CF5" }}
        >
          <span className="text-white text-base font-medium">AR</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-900">Ali Raza</h3>
          <p className="text-sm text-gray-500 truncate">dev.logoanimations@gmail.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <a
          href="/user-profile"
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={onClose}
        >
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-base">Profile</span>
        </a>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="text-base">Account settings</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          <LogOut className="w-5 h-5 text-gray-600" />
          <span className="text-base">Log out</span>
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
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Desktop Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#795CF5]"
            style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {anyUnread && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#D1202D" }} />
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
        <button className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#795CF5" }}
            aria-label="Open profile menu"
          >
            <span className="text-white text-base font-medium">AR</span>
          </button>

          {profileDropdownOpen && <ProfileMenu onClose={() => setProfileDropdownOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
