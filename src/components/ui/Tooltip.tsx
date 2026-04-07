"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    content: string | React.ReactNode;
    position?: TooltipPosition;
    children: React.ReactNode;
    className?: string; // Applied to tooltip content
    wrapperClassName?: string; // Applied to tooltip wrapper
    delay?: number;
    showArrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    position = "top",
    children,
    className,
    wrapperClassName,
    delay = 0.2,
    showArrow = true,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
        left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
        right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-bg-secondary/95",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-bg-secondary/95",
        left: "left-full top-1/2 -translate-y-1/2 border-l-bg-secondary/95",
        right: "right-full top-1/2 -translate-y-1/2 border-r-bg-secondary/95",
    };

    // Animation variants based on position
    const variants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: position === "top" ? 4 : position === "bottom" ? -4 : 0,
            x: position === "left" ? 4 : position === "right" ? -4 : 0,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: position === "top" ? 2 : position === "bottom" ? -2 : 0,
            x: position === "left" ? 2 : position === "right" ? -2 : 0,
        },
    };

    return (
        <div
            className={cn("group relative inline-block", wrapperClassName)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: delay,
                        }}
                        className={cn(
                            "pointer-events-none absolute z-9999 whitespace-nowrap rounded-lg border border-border/50 bg-bg-secondary/95 px-3 py-2 text-body-tiny font-medium text-text shadow-xl backdrop-blur-md",
                            positionClasses[position],
                            className
                        )}
                    >
                        {content}
                        {showArrow && (
                            <div
                                className={cn(
                                    "absolute border-[5px] border-transparent",
                                    arrowClasses[position]
                                )}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

