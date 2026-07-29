import { SvgIcon } from "@/components/ui/SvgIcon";
import Image from "next/image";

// Cropped from public/Icons/OI.svg (icon-only, wordmark stripped) so it can sit
// above its own "OWNERS INVENTORY" caption instead of the baked-in lockup text.
const OwnersInventoryMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 50 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30.459 25.478H34.6341C33.6424 27.7021 32.2123 29.6851 30.459 31.323V25.478Z"
      fill="#795CF5"
    />
    <path
      d="M34.7382 10.9559H25.429V25.478H15.939V36.0669C6.9586 34.9987 0 27.3624 0 18.0992C0 8.1019 8.10376 0 18.1033 0C25.566 0 31.9712 4.51384 34.7382 10.9559Z"
      fill="#795CF5"
    />
    <path
      d="M30.459 25.4779V31.3229C28.4207 33.2292 25.9386 34.6699 23.1881 35.4697C21.5772 35.9408 19.8676 36.1928 18.0979 36.1928C17.3636 36.1928 16.6404 36.149 15.9336 36.0613V25.4779H30.459Z"
      fill="#795CF5"
    />
    <path
      d="M36.2067 18.0992C36.2067 19.8302 35.9656 21.501 35.5108 23.0896C35.2752 23.9113 34.9848 24.7111 34.6396 25.478H25.4345V10.9559H34.7382C35.6862 13.1471 36.2067 15.5629 36.2067 18.0992Z"
      fill="#795CF5"
    />
    <path
      d="M29.459 25.478C30.0113 25.478 30.459 25.9257 30.459 26.478V31.323C28.4207 33.2293 25.9386 34.67 23.1881 35.4698C21.5772 35.9409 19.8676 36.1929 18.0979 36.1929C17.3636 36.1929 16.6404 36.1491 15.9336 36.0614V26.478C15.9336 25.9257 16.3813 25.478 16.9336 25.478H29.459Z"
      fill="#137F6A"
    />
    <path
      d="M30.459 31.3229V39C30.459 39.5522 30.0112 40 29.459 40H16.939C16.3867 40 15.939 39.5522 15.939 39V36.0668C16.6513 36.149 17.3746 36.1983 18.1033 36.1983C19.8676 36.1983 21.5771 35.9463 23.1935 35.4752C25.9441 34.6699 28.4207 33.2292 30.459 31.3229Z"
      fill="#1AD1B9"
    />
    <path
      d="M48.4445 25.478H35.9191C35.3668 25.478 34.9191 25.9257 34.9191 26.478V39.0001C34.9191 39.5524 35.3668 40.0001 35.9191 40.0001H48.4445C48.9968 40.0001 49.4445 39.5524 49.4445 39.0001V26.478C49.4445 25.9257 48.9968 25.478 48.4445 25.478Z"
      fill="#FFCB00"
    />
    <path
      d="M36.2067 18.0992C36.2067 19.8302 35.9656 21.501 35.5108 23.0896C35.2752 23.9113 34.9848 24.7111 34.6396 25.478H26.4345C25.8823 25.478 25.4345 25.0303 25.4345 24.478V11.9559C25.4345 11.4036 25.8823 10.9559 26.4345 10.9559H34.7382C35.6862 13.1471 36.2067 15.5629 36.2067 18.0992Z"
      fill="#B11E67"
    />
    <path
      d="M38.9489 10.9559C39.5012 10.9559 39.9489 11.4036 39.9489 11.9559V24.478C39.9489 25.0303 39.5012 25.478 38.9489 25.478H34.6341C34.9793 24.7111 35.2697 23.9113 35.5053 23.0896C35.9601 21.5065 36.2012 19.8302 36.2012 18.0992C36.2012 15.5629 35.6806 13.1471 34.7327 10.9559H38.9489Z"
      fill="#F95C5B"
    />
  </svg>
);

/** Left dark brand column shared by every auth screen (hidden below `lg`). */
export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[42%] xl:basis-151.25 xl:flex-none flex-col items-center justify-center bg-[#232228] px-10 py-16 text-center">
      <SvgIcon name="ownersUniverseColl" width={80} height={80} />
      <div className="mt-4 flex flex-col items-center">
        <span className="text-white text-2xl font-extrabold leading-none">
          owners
        </span>
        <span className="text-white text-base font-bold tracking-[0.3em] mt-1">
          UNIVERSE
        </span>
      </div>

      <p className="mt-8 text-gray-300 text-base leading-relaxed max-w-65">
        One account for every tool your business needs.
      </p>

      <span className="mt-10 text-gray-500 text-xs font-semibold tracking-[0.2em]">
        PRODUCTS
      </span>

      <div className="mt-4 flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <SvgIcon name="OP" width={58} height={38} />
          <span className="text-gray-400 text-[11px] font-semibold tracking-wider">
            OWNERS PULSE
          </span>
        </div>
        <div className="h-10 w-px bg-gray-600" />
        <div className="flex flex-col items-center gap-2">
          <OwnersInventoryMark className="w-12.25 h-10" />
          <span className="text-gray-400 text-[11px] font-semibold tracking-wider">
            OWNERS INVENTORY
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared two-panel auth shell (brand panel + gradient form panel) used by every
 * page in the (auth) route group so they all match the login page's design.
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthBrandPanel />

      <div className="flex-1 relative overflow-hidden flex flex-col bg-white px-6 py-12">
        <div className="auth-gradient-backdrop">
          <Image
            src="/images/auth-gradient-blob.svg"
            alt="onwers-univers-login"
            width={100}
            height={100}
          />
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          <div className="w-full max-w-100">{children}</div>
        </div>

        <p className="relative text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Owners Universe. All rights reserved.
        </p>
      </div>
    </div>
  );
}
