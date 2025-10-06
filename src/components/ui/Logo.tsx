import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
interface LogoProps {
  /**
   * Width of the logo in pixels
   * @default 120
   */
  width?: number;
  /**
   * Height of the logo in pixels
   * @default 40
   */
  height?: number;
  /**
   * Alternative text for the logo
   * @default "Owner Universe Logo"
   */
  alt?: string;
  /**
   * Additional CSS classes to apply to the logo container
   */
  className?: string;
  /**
   * Whether the logo should be clickable and link to home
   * @default false
   */
  isClickable?: boolean;
  /**
   * Priority loading for the image (useful for above-the-fold logos)
   * @default true
   */
  priority?: boolean;
  /**
   * Custom onClick handler
   */
  onClick?: () => void;
  Icon?: string | StaticImport;
}

const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 40,
  alt = "Owner Universe Logo",
  className = "",
  isClickable = false,
  priority = true,
  onClick,
  Icon,
}) => {
  const logoContent = (
    <div
      className={`relative inline-block ${isClickable ? 'cursor-pointer transition-opacity hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      <Image
        src={Icon ?? "/Icons/Owners Universe coll.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );

  if (isClickable && !onClick) {
    return (
      <a href="/" className="inline-block">
        {logoContent}
      </a>
    );
  }

  return logoContent;
};

export default Logo;
