"use client";

import { useState } from "react";
import Image from "next/image";
import { Icons } from "@/components/utils/icons";

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

return (
  <main className="p-3">
    <div className="flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:p-10">
        {/* Left Panel */}
        <div
          className="w-full lg:w-[420px] flex flex-col items-center p-6 rounded-t lg:rounded-l lg:rounded-tr-none lg:h-[550px]"
          style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <Image
              src={Icons.security}
              alt="Security Shield Icon"
              width={100}
              height={100}
            />
            <h2 className="text-heading-1 mt-10 font-bold text-black">Password Security</h2>
            <ul className="mt-5 space-y-3 text-body-small text-black">
              <li>• At least 8 characters</li>
              <li>• Include numbers and symbols</li>
              <li>• Mix uppercase & lowercase</li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white p-9 rounded-b lg:rounded-r lg:rounded-bl-none flex items-center justify-center">
          <div className="w-full max-w-md space-y-5">
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-heading-1 font-bold text-black">Change Password</h1>
              <p className="text-body-small text-gray-500 leading-snug">
                Ensure your account stays secure with a strong password that you don’t use elsewhere.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-body-small font-medium text-black">
                  Current Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-body-medium pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Image
                      src={Icons.view}
                      alt="Toggle password visibility"
                      width={16}
                      height={16}
                      className={showCurrentPassword ? "opacity-100" : "opacity-60"}
                    />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-body-small font-medium text-black">
                  New Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-body-medium pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Image
                      src={Icons.view}
                      alt="Toggle password visibility"
                      width={16}
                      height={16}
                      className={showNewPassword ? "opacity-100" : "opacity-60"}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-body-small font-medium text-black">
                  Confirm New Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-body-medium pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Image
                      src={Icons.view}
                      alt="Toggle password visibility"
                      width={16}
                      height={16}
                      className={showConfirmPassword ? "opacity-100" : "opacity-60"}
                    />
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <button className="w-full px-4 py-2 rounded text-white text-body-medium font-medium transition-colors cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]">
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
