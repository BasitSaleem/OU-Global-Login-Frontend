import React from 'react';
import { IconName, SvgIcon } from './SvgIcon';
interface LogoProps {

  width?: number;

  height?: number;

  alt?: string;

  className?: string;

  isClickable?: boolean;

  priority?: boolean;

  onClick?: () => void;
  Icon?: IconName;
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
      <SvgIcon
        name={Icon!}
        className="text-foreground"
        width={width}
        height={height}
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
