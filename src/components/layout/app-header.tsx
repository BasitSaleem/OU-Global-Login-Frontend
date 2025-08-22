'use client';

import {
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

export default function AppHeader({ 
  onToggleSidebar, 
  onToggleMobileSidebar, 
  mobileSidebarOpen 
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      {/* Left side: Menu Toggle + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Desktop Menu Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 hover:bg-gray-50 rounded-lg transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {mobileSidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 text-base placeholder-gray-500 focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)', focusRingColor: '#795CF5' }}
          />
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#D1202D' }}></div>
          </button>
          
          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-[650px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[755px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-black">Notifications</h2>
                <a
                  href="/notifications"
                  className="text-primary text-base font-medium underline hover:no-underline"
                >
                  View All
                </a>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between px-6 py-4">
                <button className="text-primary text-base font-medium hover:underline">
                  Mark all as read
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-base">Only show unread</span>
                  <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                  </div>
                </div>
              </div>
              
              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {/* Notification Item 1 */}
                <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium" style={{ backgroundColor: '#137F6A' }}>
                    BS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">Basit Saleem</span> updated a page
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-base">Just now</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#795CF5' }}></div>
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-black mb-1">Owners AI Bot</h4>
                    <p className="text-sm text-gray-500 mb-2">RS-Owners-Inventory</p>
                    <p className="text-sm font-bold text-gray-500">+3 updates from Basit Saleem</p>
                  </div>
                </div>
                
                {/* Notification Item 2 */}
                <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium" style={{ backgroundColor: '#B11E67' }}>
                    JS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">John Smith</span> updated a page
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-base">2 mins ago</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#795CF5' }}></div>
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-black mb-1">Editors AI Bot</h4>
                    <p className="text-sm text-gray-500 mb-2">RS-Editors-Inventory</p>
                    <p className="text-sm font-bold text-gray-500">+2 updates from John Smith</p>
                  </div>
                </div>
                
                {/* Notification Item 3 */}
                <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium" style={{ backgroundColor: '#1AD1B9' }}>
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">Alice Sanders</span> updated a page
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-base">1 days ago</span>
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-black mb-1">Managers AI Bot</h4>
                    <p className="text-sm text-gray-500 mb-2">RS-Managers-Inventory</p>
                    <p className="text-sm font-bold text-gray-500">+1 update from Alice Sanders</p>
                  </div>
                </div>
                
                {/* Notification Item 4 */}
                <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium" style={{ backgroundColor: '#FF7C3B' }}>
                    TH
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">Tom Hanks</span> updated a page
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-base">1 week ago</span>
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-black mb-1">Admins AI Bot</h4>
                    <p className="text-sm text-gray-500 mb-2">RS-Admins-Inventory</p>
                    <p className="text-sm font-bold text-gray-500">+5 updates from Tom Hanks</p>
                  </div>
                </div>
                
                {/* Notification Item 5 */}
                <div className="flex items-start gap-6 p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium" style={{ backgroundColor: '#F95C5B' }}>
                    DS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">David Smith</span> updated a page
                      </p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-base">2 weeks ago</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#795CF5' }}></div>
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-black mb-1">Supervisors AI Bot</h4>
                    <p className="text-sm text-gray-500 mb-2">RS-Supervisors-Inventory</p>
                    <p className="text-sm font-bold text-gray-500">+4 updates from David Smith</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Settings */}
        <button className="p-2 hover:bg-gray-50 rounded-lg">
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
        
        {/* User Avatar with Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button 
            onClick={toggleProfileDropdown}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" 
            style={{ backgroundColor: '#795CF5' }}
          >
            <span className="text-white text-base font-medium">AR</span>
          </button>
          
          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              {/* User Info Section */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#795CF5' }}>
                  <span className="text-white text-base font-medium">AR</span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">Ali Raza</h3>
                  <p className="text-sm text-gray-500 truncate">dev.logoanimations@gmail.com</p>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="p-2">
                {/* Profile */}
                <a href="/user-profile" className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-base">Profile</span>
                </a>
                
                {/* Account Settings */}
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-base">Account settings</span>
                </button>
                
                {/* Log Out */}
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="text-base">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
