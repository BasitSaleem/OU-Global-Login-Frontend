"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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

const GAP = 10; // distance between trigger and tooltip, in px

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
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Portaled to document.body and positioned via getBoundingClientRect so the
    // tooltip escapes any ancestor's `overflow: hidden` (e.g. a modal) instead
    // of being clipped when it's wider than the clipping container.
    useLayoutEffect(() => {
        if (!isVisible || !wrapperRef.current) return;

        const updatePosition = () => {
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (!rect) return;
            switch (position) {
                case "top":
                    setCoords({ top: rect.top - GAP, left: rect.left + rect.width / 2 });
                    break;
                case "bottom":
                    setCoords({ top: rect.bottom + GAP, left: rect.left + rect.width / 2 });
                    break;
                case "left":
                    setCoords({ top: rect.top + rect.height / 2, left: rect.left - GAP });
                    break;
                case "right":
                    setCoords({ top: rect.top + rect.height / 2, left: rect.right + GAP });
                    break;
            }
        };

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isVisible, position]);

    const originClasses = {
        top: "-translate-x-1/2 -translate-y-full",
        bottom: "-translate-x-1/2",
        left: "-translate-x-full -translate-y-1/2",
        right: "-translate-y-1/2",
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
            ref={wrapperRef}
            className={cn("group relative inline-block", wrapperClassName)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {isVisible && content && coords && (
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
                                style={{ position: "fixed", top: coords.top, left: coords.left }}
                                className={cn(
                                    "pointer-events-none z-9999 whitespace-nowrap rounded-lg border border-border/50 bg-bg-secondary/95 px-3 py-2 text-body-tiny font-medium text-text shadow-xl backdrop-blur-md",
                                    originClasses[position],
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
                    </AnimatePresence>,
                    document.body
                )}
        </div>
    );
};
