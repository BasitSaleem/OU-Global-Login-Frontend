'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="p-4 sm:p-8">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl">
          
          {/* Left Panel - Security Guidelines */}
          <div 
            className="w-full lg:w-[320px] xl:w-[450px] flex flex-col items-center p-6 sm:p-9 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
            style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
          >
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              {/* Security Shield Icon */}
              <div className="mb-6 sm:mb-8">
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M89.8257 20.88C89.7821 20.1904 89.5303 19.5878 89.0703 19.0722C88.6103 18.5566 88.0403 18.238 87.3601 18.1163C71.1413 15.2063 64.3707 13.1025 49.2357 6.26628C48.843 6.08876 48.4311 6 48.0001 6C47.5691 6 47.1572 6.08876 46.7645 6.26628C31.6295 13.1025 24.8588 15.2063 8.64008 18.1163C7.95991 18.238 7.38984 18.5566 6.92985 19.0722C6.46987 19.5878 6.21807 20.1904 6.17445 20.88C5.45258 32.3382 6.99195 43.0144 10.7551 52.6125C12.2959 56.527 14.196 60.2586 16.4555 63.8071C18.7151 67.3557 21.2924 70.656 24.1876 73.7081C34.2132 84.345 44.8576 88.965 46.8882 89.7825C47.249 89.9285 47.624 90.0014 48.0132 90.0014C48.4024 90.0014 48.7774 89.9285 49.1382 89.7825C51.1688 88.965 61.8132 84.345 71.8388 73.7081C74.7293 70.6549 77.3021 67.354 79.5571 63.8055C81.8122 60.257 83.7082 56.526 85.2451 52.6125C89.0082 43.0144 90.5476 32.3381 89.8257 20.88ZM65.2632 34.9632L44.4882 58.9632C44.2183 59.2759 43.8974 59.5224 43.5256 59.7025C43.1538 59.8827 42.7616 59.9819 42.3488 60H42.2251C41.8325 60.0001 41.4545 59.926 41.091 59.7777C40.7275 59.6294 40.4055 59.4179 40.1251 59.1431L30.9001 50.1056C30.3083 49.5257 30.0082 48.8215 29.9997 47.993C29.9913 47.1645 30.2771 46.4543 30.857 45.8625C31.4369 45.2707 32.1411 44.9706 32.9696 44.9622C33.7981 44.9538 34.5083 45.2395 35.1001 45.8194L42.0376 52.6238L60.7313 31.0369C61.2736 30.4109 61.9577 30.0681 62.7837 30.0087C63.6098 29.9492 64.336 30.1905 64.9622 30.7324C65.5885 31.2743 65.9316 31.9583 65.9915 32.7843C66.0513 33.6103 65.8104 34.3366 65.2688 34.9631L65.2632 34.9632Z" fill="#795CF5"/>
                </svg>
              </div>
              
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
                Password Security
              </h2>
              
              {/* Requirements List */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-base text-black">At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-black">Include numbers and symbols</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-black">Mix uppercase & lowercase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Password Form */}
          <div className="flex-1 bg-white p-6 sm:p-10 lg:p-20 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-black">Change Password</h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Ensure your account stays secure with a strong password that you don't use elsewhere.
                </p>
              </div>
              
              {/* Form */}
              <div className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Current Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Confirm New Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Update Button */}
                <button 
                  className="w-full px-6 py-3 rounded-lg text-white text-base font-medium transition-colors cursor-pointer"
                  style={{ backgroundColor: '#795CF5' }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
