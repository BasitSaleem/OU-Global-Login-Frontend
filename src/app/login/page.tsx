"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple redirect to home page - no authentication logic for now
    router.push("/");
  };

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

      {/* Header with logo and sign up */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/b6883933800beaaed00fccc27c64d8d36242d8ba?width=278"
          alt="Owners Universe Logo"
          className="h-6 sm:h-8 lg:h-10"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">
            Don't have an account?
          </span>
          <Link
            href="/sign-up"
            className="bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex items-center justify-center px-6 h-[450px] sm:h-full sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
        {/* Main login card */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md xl:max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.06)] px-4 sm:px-14 py-3 sm:py-4">
            {/* Welcome heading */}
            <div className="text-center mb-3 mt-2 sm:mb-4">
              <h1 className="text-base sm:text-xl font-bold text-gray-900">
                Welcome back
              </h1>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full h-8 sm:h-9 px-3 bg-gray-100 border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all"
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full h-8 sm:h-9 px-3 bg-gray-100 border-0 rounded-lg text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#795CF5] transition-all pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="12"
                      viewBox="0 0 22 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    >
                      <path
                        d="M2.27489 12.2957C1.42496 11.1915 1 10.6394 1 9C1 7.3606 1.42496 6.80853 2.27489 5.70433C3.97196 3.49956 6.81811 1 11 1C15.1819 1 18.028 3.49956 19.7251 5.70433C20.575 6.80853 21 7.3606 21 9C21 10.6394 20.575 11.1915 19.7251 12.2957C18.028 14.5004 15.1819 17 11 17C6.81811 17 3.97196 14.5004 2.27489 12.2957Z"
                        stroke="#C9C8CD"
                        strokeWidth="2"
                      />
                      <path
                        d="M14 9C14 10.6569 12.6569 12 11 12C9.3431 12 8 10.6569 8 9C8 7.3431 9.3431 6 11 6C12.6569 6 14 7.3431 14 9Z"
                        stroke="#C9C8CD"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between pt-1 sm:pt-2">
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3 h-3 sm:w-4 sm:h-4 appearance-none border border-gray-400 rounded checked:bg-[#795CF5] focus:ring-1 focus:ring-[#795CF5] cursor-pointer"
                  />

                  <span className="text-xs text-gray-900 font-semibold">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#795CF5] underline hover:underline"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Sign In button */}
              <div className="pt-2 sm:pt-3 sm:mt-5">
                <button
                  type="submit"
                  className="w-full h-8 sm:h-9 bg-[#795CF5] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-3 sm:my-7 flex items-center">
              <div className="flex-1 border-t border-[#C9C8CD]"></div>
              <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                Or
              </span>
              <div className="flex-1 border-t border-[#C9C8CD]"></div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-2 sm:space-y-5">
              <button className="cursor-pointer w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border border-[#C9C8CD] rounded-full hover:bg-gray-50 transition-colors">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/dd3b649d040969f0c8d38d8d09939f56ff9ac765?width=48"
                  alt="Google"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span className="text-xs sm:text-sm text-gray-900">
                  Continue with Google
                </span>
              </button>
              <button className="cursor-pointer w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 border border-[#C9C8CD] rounded-full hover:bg-gray-50 transition-colors">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d812f75e7b50b0dc62e53bde84d2928047908c47?width=48"
                  alt="Microsoft"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span className="text-xs sm:text-sm text-gray-900">
                  Continue with Microsoft
                </span>
              </button>
            </div>

            {/* Sign up link */}
            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs sm:text-sm text-gray-900">
                Don't have an account{" "}
              </span>
              <Link
                href="/sign-up"
                className="underline text-xs sm:text-sm font-bold text-[#795CF5] hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10 pb-2 sm:pb-4 ">
        <p className="text-sm text-gray-700">
          ©2025 Owners Inventory - All rights reserved
        </p>
      </div>
    </div>
  );
}
