'use client';

import {
  Bell,
  Home
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function UserProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

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

  const profileNavItems = [
    {
      label: 'Profile',
      href: '/user-profile',
      icon: Home,
      isActive: pathname === '/user-profile'
    },
    {
      label: 'Email',
      href: '/user-profile/email',
      icon: (props: any) => (
        <svg {...props} width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.75" y="0.75" width="19.5" height="13.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M0.75 3.75L10.5 8.25L20.25 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      isActive: pathname === '/user-profile/email'
    },
    {
      label: 'Change Password',
      href: '/user-profile/change-password',
      icon: (props: any) => (
        <svg {...props} width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.145 0C10.4226 0 8.09884 0.976311 6.1738 2.92893C4.24877 4.88155 3.28625 7.23858 3.28625 10H0L4.38166 14.4444L8.76332 10H5.47708C5.47708 5.71111 8.91668 2.22222 13.145 2.22222C17.3733 2.22222 20.8129 5.71111 20.8129 10C20.8129 14.2889 17.3733 17.7778 13.145 17.7778C11.0637 17.7778 9.17958 16.9333 7.79936 15.5667L6.24387 17.1333C7.16409 18.0519 8.22158 18.7593 9.41632 19.2556C10.6111 19.7519 11.854 20 13.145 20C15.8667 19.999 18.1897 19.0223 20.114 17.0698C22.0382 15.1174 23.0003 12.7607 23.0003 10C23.0003 7.23925 22.0382 4.88263 20.114 2.93015C18.1897 0.97767 15.8667 0.000952968 13.145 0ZM15.3358 8.88889V7.77778C15.3358 6.55556 14.3499 5.55556 13.145 5.55556C11.94 5.55556 10.9542 6.55556 10.9542 7.77778V8.88889C10.3517 8.88889 9.85874 9.38889 9.85874 10V13.3333C9.85874 13.9444 10.3517 14.4444 10.9542 14.4444H15.3358C15.9383 14.4444 16.4312 13.9444 16.4312 13.3333V10C16.4312 9.38889 15.9383 8.88889 15.3358 8.88889ZM14.2404 8.88889H12.0496V7.77778C12.0496 7.16667 12.5425 6.66667 13.145 6.66667C13.7475 6.66667 14.2404 7.16667 14.2404 7.77778V8.88889Z" fill="currentColor"/>
        </svg>
      ),
      isActive: pathname === '/user-profile/change-password'
    },
    {
      label: 'Notifications',
      href: '/user-profile/notifications',
      icon: Bell,
      isActive: pathname === '/user-profile/notifications'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white flex font-inter">
        {/* Page Content */}
        <main className="flex-1">
         <div className="flex flex-col sm:flex-row items-start gap-6 p-5">

            {/* Left Panel - User Info */}
             <div className="flex flex-col items-start mx-auto gap-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              {/* Profile Photo */}
              <div className="flex flex-col items-center gap-9">
                <div 
                  className="w-[108px] h-[108px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
                >
                  <svg width="35" height="35" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.78125 9.71875C3.78125 7.64768 5.46018 5.96875 7.53125 5.96875H28.4688C30.5398 5.96875 32.2188 7.64768 32.2188 9.71875V26.2813C32.2188 28.3523 30.5398 30.0312 28.4687 30.0312H7.53125C5.46018 30.0312 3.78125 28.3523 3.78125 26.2813V9.71875Z" stroke="#4B5563" strokeWidth="2.5" strokeLinejoin="round"/>
                    <circle cx="23.4688" cy="12.5312" r="2.1875" stroke="#4B5563" strokeWidth="2.5"/>
                    <path d="M21.2812 23.4554L15.0838 17.2696C14.6745 16.8603 14.1805 16.6471 13.602 16.63C13.0234 16.6129 12.5177 16.7964 12.0849 17.1807L3.78125 24.5635M15.8125 30.0323L24.2439 21.6008C24.6435 21.2004 25.1259 20.9871 25.6909 20.9609C26.256 20.9347 26.756 21.1024 27.1909 21.4641L32.2188 25.6573" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <button className="px-14 py-2 border border-[#795CF5] rounded-md text-[#795CF5] font-medium hover:bg-purple-50 transition-colors cursor-pointer">
                  Change Photo
                </button>
              </div>
              
              {/* User Details */}
              <div className="space-y-4 w-full">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="text-base font-medium text-black">John Doe</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-base font-medium text-black">john@example.com</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Contact</label>
                  <p className="text-base font-medium text-black">+1 234 567 890</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Profile Form */}
            <div className="flex-1 border border-gray-200 rounded-lg w-full bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-black">Profile Information</h1>
              </div>
              
              {/* Form Content */}
              <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Contact
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-4">Address Information</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Tax/VAT Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-4">Emergency Contact</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Emergency Contact Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button 
                    className="px-6 py-2.5 rounded-md text-white bg-[#785cf5] text-base hover:scale-105 cursor-pointer font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
