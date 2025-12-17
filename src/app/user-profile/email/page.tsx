'use client'

import Image from "next/image"
import { Icons } from "@/components/utils/icons";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { FileText, FileWarning, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui";

export default function EmailSettingsPage() {
  return (
    <main className="p-5">
      <div className="w-full max-w-4xl p-3">
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
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4  rounded bg-primary/10"
          >
            <TriangleAlert className="mb-6 opacity-60" />
            <p className="font-medium text-black">
              Changing your email will disconnect your Google account. You'll need
              to reconnect it after confirming the new email address.
            </p>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              className=" bg-primary text-white hover:bg-primary/70"

            >
              Update Email Address
            </Button>
          </div>
        </div>
      </div>
    </main >
  );
}
