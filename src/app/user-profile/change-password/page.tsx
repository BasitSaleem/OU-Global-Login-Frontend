"use client";

import { useState } from "react";
import Image from "next/image";
import { Icons } from "@/components/utils/icons";

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="p-4 sm:p-8">
      <div className="flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl">
          {/* Left Panel */}
          <div
            className="w-full lg:w-[320px] xl:w-[450px] flex flex-col items-center p-6 sm:p-9 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
            style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
          >
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <Image
                  src={Icons.security}
                  alt="Security Shield Icon"
                  width={110}
                  height={110}
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
                Password Security
              </h2>
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

          {/* Right Panel */}
          <div className="flex-1 bg-white p-6 sm:p-10 lg:p-20 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Image
                        src={Icons.view}
                        alt="Toggle password visibility"
                        width={18}
                        height={18}
                        className={showCurrentPassword ? "opacity-100" : "opacity-60"}
                      />
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Image
                        src={Icons.view}
                        alt="Toggle password visibility"
                        width={18}
                        height={18}
                        className={showNewPassword ? "opacity-100" : "opacity-60"}
                      />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Image
                        src={Icons.view}
                        alt="Toggle password visibility"
                        width={18}
                        height={18}
                        className={showConfirmPassword ? "opacity-100" : "opacity-60"}
                      />
                    </button>
                  </div>
                </div>

                {/* Update Button */}
                <button
                  className="w-full px-6 py-3 rounded-lg text-white text-base font-medium transition-colors cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]"
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
