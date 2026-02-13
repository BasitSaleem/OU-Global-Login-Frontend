"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";
import { SvgIcon } from "./SvgIcon";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    content: string | React.ReactNode;
    position?: TooltipPosition;
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    position = "top",
    children,
    className,
    delay = 0.2,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-800",
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1, delay }}
                        className={cn(
                            "absolute z-[9999] whitespace-nowrap rounded bg-primary px-2.5 py-1.5 text-xs font-medium text-white shadow-lg",
                            positionClasses[position],
                            className
                        )}
                    // style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}
                    >
                        {/* <SvgIcon name="ownersUniverse" width={20} height={20} /> */}
                        {content}
                        <div
                            className={cn(
                                "absolute border-4 border-transparent",
                                arrowClasses[position]
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
