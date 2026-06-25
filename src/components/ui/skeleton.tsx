"use client";

import React from "react";
import { cn } from "@/utils/helpers";

interface SkeletonProps {
  width?: string | number;        // e.g., "100%", "64px"
  height?: string | number;       // e.g., "20px", "4rem"
  className?: string;             // Additional Tailwind classes
  circle?: boolean;               // Render as circle
  rounded?: boolean;              // Apply rounded corners
  style?: React.CSSProperties;    // Inline styles
  count?: number;                 // For rendering multiple skeletons
  animate?: boolean;              // Animate shimmer pulse
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
  circle = false,
  rounded = true,
  style = {},
  count = 1,
  animate = true,
}) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--color-skeleton-base, #efefef) 25%,
            var(--color-skeleton-highlight, #f8f8f8) 37%,
            var(--color-skeleton-base, #efefef) 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
        }
        .dark .skeleton-shimmer {
          --color-skeleton-base: #1a1a1a;
          --color-skeleton-highlight: #262626;
        }
      `}</style>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "skeleton-shimmer",
            rounded && !circle ? "rounded-md" : "",
            circle ? "rounded-full" : "",
            !animate && "animate-none grayscale",
            className
          )}
          style={{
            width,
            height,
            ...style,
          }}
        />
      ))}
    </>
  );
};
