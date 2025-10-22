'use client';
import { Button, Input } from '@/components/ui';
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
          <rect x="0.75" y="0.75" width="19.5" height="13.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0.75 3.75L10.5 8.25L20.25 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      isActive: pathname === '/user-profile/email'
    },
    {
      label: 'Change Password',
      href: '/user-profile/change-password',
      icon: (props: any) => (
        <svg {...props} width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.145 0C10.4226 0 8.09884 0.976311 6.1738 2.92893C4.24877 4.88155 3.28625 7.23858 3.28625 10H0L4.38166 14.4444L8.76332 10H5.47708C5.47708 5.71111 8.91668 2.22222 13.145 2.22222C17.3733 2.22222 20.8129 5.71111 20.8129 10C20.8129 14.2889 17.3733 17.7778 13.145 17.7778C11.0637 17.7778 9.17958 16.9333 7.79936 15.5667L6.24387 17.1333C7.16409 18.0519 8.22158 18.7593 9.41632 19.2556C10.6111 19.7519 11.854 20 13.145 20C15.8667 19.999 18.1897 19.0223 20.114 17.0698C22.0382 15.1174 23.0003 12.7607 23.0003 10C23.0003 7.23925 22.0382 4.88263 20.114 2.93015C18.1897 0.97767 15.8667 0.000952968 13.145 0ZM15.3358 8.88889V7.77778C15.3358 6.55556 14.3499 5.55556 13.145 5.55556C11.94 5.55556 10.9542 6.55556 10.9542 7.77778V8.88889C10.3517 8.88889 9.85874 9.38889 9.85874 10V13.3333C9.85874 13.9444 10.3517 14.4444 10.9542 14.4444H15.3358C15.9383 14.4444 16.4312 13.9444 16.4312 13.3333V10C16.4312 9.38889 15.9383 8.88889 15.3358 8.88889ZM14.2404 8.88889H12.0496V7.77778C12.0496 7.16667 12.5425 6.66667 13.145 6.66667C13.7475 6.66667 14.2404 7.16667 14.2404 7.77778V8.88889Z" fill="currentColor" />
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
    <div className="min-h-screen w-full bg-background flex font-inter">
      {/* Page Content */}
      <main className="flex-1">
        <div className="flex flex-col  sm:flex-row items-start gap-5 p-8">

          {/* Left Panel - User Info */}
          <div className="flex flex-col mx-auto w-full md:w-[286px] gap-3 p-3 border rounded-lg bg-bg-secondary shadow-sm py-5">
            {/* Profile Photo */}
            <div className="flex flex-col items-center  gap-7">
              <div
                className="w-23 h-23 rounded-full flex items-center justify-center bg-[#795CF512] "
              >
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.78125 9.71875C3.78125 7.64768 5.46018 5.96875 7.53125 5.96875H28.4688C30.5398 5.96875 32.2188 7.64768 32.2188 9.71875V26.2813C32.2188 28.3523 30.5398 30.0312 28.4687 30.0312H7.53125C5.46018 30.0312 3.78125 28.3523 3.78125 26.2813V9.71875Z" stroke="#4B5563" strokeWidth="2.5" strokeLinejoin="round" />
                  <circle cx="23.4688" cy="12.5312" r="2.1875" stroke="#4B5563" strokeWidth="2.5" />
                  <path d="M21.2812 23.4554L15.0838 17.2696C14.6745 16.8603 14.1805 16.6471 13.602 16.63C13.0234 16.6129 12.5177 16.7964 12.0849 17.1807L3.78125 24.5635M15.8125 30.0323L24.2439 21.6008C24.6435 21.2004 25.1259 20.9871 25.6909 20.9609C26.256 20.9347 26.756 21.1024 27.1909 21.4641L32.2188 25.6573" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <Button variant='secondary'
                className=" w-56 text-primary hover:text-[#ffff]"
              >
                Change Photo
              </Button>
            </div>

            {/* User Details */}
            <div className="space-y-5 flex flex-col justify-center ml-6">
              <div>
                <label className="text-body-small">Name</label>
                <p className="text-body-medium-bold">Basit Saleem</p>
              </div>
              <div>
                <label className="text-body-small ">Email</label>
                <p className="text-body-medium-bold ">basit@example.com</p>
              </div>
              <div>
                <label className="text-body-small ">Contact</label>
                <p className="text-body-medium-bold">+1 234 567 890</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Profile Form */}
          <div className="flex-1 border  rounded-lg w-full bg-bg-secondary shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h1 className="text-heading-1 font-bold text-black">Profile Information</h1>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>

                  <Input
                    label='First Name'
                    isRequired
                    type="text"
                  />
                </div>

                <div>

                  <Input
                    isRequired
                    label='Last Name'
                    type="text"
                  />
                </div>

                <div>

                  <Input
                    label='Email'
                    isRequired
                    type="email"
                  />
                </div>

                <div>

                  <Input
                    label='Contact'
                    isRequired
                    type="tel"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-heading-2 font-bold text-black mb-2">Address Information</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>

                    <Input
                      label='Street Address'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                      label='City'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                      label='State'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                    label='Zip Code'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                      label='Country'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                      label='Tax/VAT Number'
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h2 className="text-heading-2 font-bold text-black mb-2">Emergency Contact</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>

                    <Input
                      label='Emergency Contact Name'
                      type="text"
                    />
                  </div>

                  <div>

                    <Input
                      label='Emergency Contact Number'
                      type="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  className="px-3 py-1.5 rounded text-white bg-primary hover:bg-primary/80 text-body-medium cursor-pointer font-medium transition-colors"
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
