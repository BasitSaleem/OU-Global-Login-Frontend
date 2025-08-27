'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/c50393b05848b5d4a774880c9a82dc541689594f?width=3660" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header with logo and home button */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <Link href="/">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/b6883933800beaaed00fccc27c64d8d36242d8ba?width=278" 
            alt="Owners Universe Logo" 
            className="h-6 sm:h-8 cursor-pointer"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors">
            Go Home
          </Link>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex items-center justify-center px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
        {/* Main 404 card */}
        <div className="relative z-10 w-full max-w-xs sm:max-w-sm">
          <div className="bg-white rounded-2xl sm:rounded-[20px] shadow-[0_0_20px_0_rgba(0,0,0,0.06)] px-4 sm:px-5 py-4 sm:py-5 text-center">
            {/* 404 Icon/Number */}
            <div className="mb-3 sm:mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-2 sm:mb-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#795CF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.678 2.172C4.785 15.445 4 13.778 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.778-.785 3.445-2.322 5.172z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#795CF5] mb-1">404</h1>
            </div>

            {/* Error message */}
            <div className="mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                Oops! Page not found
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
                Don't worry, it happens to the best of us!
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Link href="/" className="w-full h-8 sm:h-9 bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold rounded-full transition-colors flex items-center justify-center">
                Take me home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="w-full h-8 sm:h-9 border border-[#795CF5] text-[#795CF5] hover:bg-purple-50 text-xs sm:text-sm font-bold rounded-full transition-colors flex items-center justify-center"
              >
                Go back
              </button>
            </div>

            {/* Help text */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs text-gray-500">
                Need help? <Link href="/login" className="text-[#795CF5] hover:underline font-medium">Contact support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10 pb-2 sm:pb-4">
        <p className="text-xs text-gray-700">©2025 Owners Inventory - All rights reserved</p>
      </div>
    </div>
  );
}
