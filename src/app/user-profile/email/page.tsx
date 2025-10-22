'use client'

import Image from "next/image"
import { Icons } from "@/components/utils/icons";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { FileText } from "lucide-react";

export default function EmailSettingsPage() {
  return (
    <main className="p-5">
      <div className="w-full max-w-4xl ">
        {/* Email Settings Card */}
        <div
          className="w-full p-7 border rounded bg-bg-secondary shadow-sm space-y-5"
          style={{ borderColor: 'rgba(121, 92, 245, 0.07)' }}
        >
          {/* Header */}
          <h1 className="text-heading-1 font-bold ">Email Settings</h1>

          {/* Current Email */}
          <div className="space-y-1">
            <label className="text-body-small font-medium ">Current Email</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 border rounded">
              <span className="text-body-medium  inline-flex justify-center items-center break-all gap-2">
              <SvgIcon className="h-5 w-5" name="email" />
                dev.logoanimations@gmail.com
              </span>
              <button className="self-end sm:self-auto p-0 hover:bg-primary/80 rounded transition-colors cursor-pointer">
               <FileText stroke="2" />
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="space-y-1">
            <label className="text-body-small font-medium text-black">Connected Accounts</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 border rounded">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2818_35)">
                    <path
                      d="M19.5312 10.2266C19.5312 15.7539 15.7461 19.6875 10.1562 19.6875C4.79688 19.6875 0.46875 15.3594 0.46875 10C0.46875 4.64062 4.79688 0.3125 10.1562 0.3125C12.7656 0.3125 14.9609 1.26953 16.6523 2.84766L14.0156 5.38281C10.5664 2.05469 4.15234 4.55469 4.15234 10C4.15234 13.3789 6.85156 16.1172 10.1562 16.1172C13.9922 16.1172 15.4297 13.3672 15.6562 11.9414H10.1562V8.60938H19.3789C19.4688 9.10547 19.5312 9.58203 19.5312 10.2266Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2818_35">
                      <rect width="20" height="20" fill="currentColor" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-body-medium text-black">
                  Google Account Connected
                </span>
              </div>
              <button className="text-body-small text-primary hover:text-primary cursor-pointer self-end sm:self-auto hover:underline bg-transparent">Manage</button>
            </div>
          </div>

          {/* New Email Address */}
          <div className="space-y-1">
            <label className="text-body-small font-medium text-black">New Email Address</label>
            <div className="relative">
              <SvgIcon className="absolute mt-1.5 ml-2 h-5 w-5" name="email" />
              <input
                type="email"
                defaultValue="zaid.hq95@gmail.com"
                className="w-full pl-9 py-1.5 border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-body-medium"
              />
            </div>
          </div>

          {/* Warning Message */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 rounded bg-red-500/60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M3.34249 17.4316H16.6573C17.1302 17.4316 17.4879 17.2285 17.7303 16.8226C17.9728 16.4166 17.9819 16.0054 17.7577 15.5891L11.1007 3.22578C10.6284 2.34922 9.3714 2.34922 8.89913 3.22578L2.2421 15.5891C2.01794 16.0054 2.02708 16.4166 2.26953 16.8225C2.51198 17.2285 2.86963 17.4316 3.34249 17.4316Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M9.77557 7.63282L9.99978 12.3984L10.2236 7.63478C10.2265 7.5705 10.2056 7.51521 10.161 7.46891C10.1163 7.42261 10.0618 7.39978 9.99744 7.4004C9.93435 7.40102 9.88102 7.42415 9.83745 7.46979C9.79388 7.51543 9.77325 7.56977 9.77557 7.63282Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M10 15.5176C9.78426 15.5176 9.60012 15.4413 9.44757 15.2888C9.29502 15.1362 9.21875 14.9521 9.21875 14.7363C9.21875 14.5206 9.29502 14.3364 9.44757 14.1839C9.60012 14.0314 9.78426 13.9551 10 13.9551C10.2157 13.9551 10.3999 14.0314 10.5524 14.1839C10.705 14.3364 10.7812 14.5206 10.7812 14.7363C10.7812 14.9521 10.705 15.1362 10.5524 15.2888C10.3999 15.4413 10.2157 15.5176 10 15.5176Z"
                fill="currentColor"
              />
            </svg>
            <p className="text-body-small font-medium text-black">
              Changing your email will disconnect your Google account. You'll need
              to reconnect it after confirming the new email address.
            </p>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              className="px-3 py-1.5 rounded text-white text-body-medium font-medium transition-colors cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]"
            >
              Update Email Address
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
