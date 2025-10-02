"use client";

import React from "react";

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
  const skeletonClass = `
    bg-gray-300
    ${rounded && !circle ? "rounded-md" : ""}
    ${circle ? "rounded-full" : ""}
    ${animate ? "animate-pulse" : ""}
    ${className}
  `;

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={skeletonClass}
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
