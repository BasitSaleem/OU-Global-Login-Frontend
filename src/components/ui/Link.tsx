"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@/utils/helpers";
import { Lock } from "lucide-react";
import { Tooltip, TooltipPosition } from "./Tooltip";

export interface LinkProps
  extends NextLinkProps,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> {
  checkAllPermissions?: boolean;
  permissionFallback?: React.ReactNode;
  variant?:
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "basic"
  | "link";
  size?: "sm" | "md" | "lg" | "xl";
  tooltip?: string | React.ReactNode;
  isShow?: boolean;
  tooltipPosition?: TooltipPosition;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  showLabel?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      children,
      variant = "link",
      size = "md",
      tooltip,
      tooltipPosition,
      leftIcon,
      rightIcon,
      label,
      isShow,
      showLabel = true,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      variant !== "link"
        ? "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        : "inline-flex items-center gap-1.5";

    const variants = {
      primary:
        "bg-primary py-4 text-white hover:bg-primary/80 rounded-lg border border-primary",
      secondary:
        "bg-bg-secondary py-4 hover:bg-primary border-primary hover:!text-btn-text border rounded-lg",
      outline:
        "border border-gray-300 bg-transparent text-primary hover:bg-gray-50 focus:ring-gray-500",
      ghost:
        "text-gray-700 py-4 hover:bg-primary/80 rounded-lg focus:ring-gray-500 border rounded-lg hover:!text-btn-text ",
      destructive:
        "bg-red py-4 !text-btn-text hover:bg-red-700 focus:ring-red-500 rounded-lg border-red border",
      basic: "",
      link: "",
    };

    const sizes = {
      sm: "h-6 px-2",
      md: "h-7 px-3",
      lg: "h-8 px-4",
      xl: "h-9 px-5",
    };

    const linkElement = (
      isShow && (
        <NextLink
          className={cn(
            baseStyles,
            variant !== "link" && variants[variant],
            variant !== "link" && sizes[size],
            className,
          )}
          {...props}
          ref={ref}
        >
          {leftIcon}
          {showLabel && (
            <>
              {label && <span className="truncate">{label}</span>}
              {children}
            </>
          )}
          {rightIcon}
        </NextLink>
      )
    );

    const finalElement = tooltip ? (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {linkElement}
      </Tooltip>
    ) : (
      linkElement
    );
    return (
      <div
      >
        {finalElement}
      </div>
    );
  },
);

export { Link };
