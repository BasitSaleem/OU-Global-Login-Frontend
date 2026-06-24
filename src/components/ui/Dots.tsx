'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DotsProps {
    className?: string;
    dotSize?: number | string;
    text?: string;
    position?: "left" | "right";
}

export const Dots: React.FC<DotsProps> = ({
    className = "",
    dotSize = "4px",
    text,
    position = "left"
}) => {
    const dots = (
        <>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                    className="rounded-full bg-current ml-0.5"
                    style={{
                        width: dotSize,
                        height: dotSize,
                    }}
                />
            ))}
        </>
    );

    return (
        <span className={`inline-flex items-center ml-1 ${className}`}>
            {position === "left" && text && <span className="mr-1">{text}</span>}
            {dots}
            {position === "right" && text && <span className="ml-1">{text}</span>}
        </span>
    );
};