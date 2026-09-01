'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SvgIcon } from './SvgIcon';
import { Dots } from './Dots';
import { cn } from '@/utils/helpers';

interface LoaderProps {
    text?: string;
    className?: string;
    iconSize?: number;
}

export const Loader: React.FC<LoaderProps> = ({
    className = "",
    iconSize = 80,
    text
}) => {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-background/80 backdrop-blur-sm overflow-hidden",
                className
            )}
            aria-modal="true"
            role="status"
        >            <div className="relative flex items-center justify-center">
                {/* The Owners Universe mark breathes in place. Its brand colours
                    are fixed (#795CF5 / #F95C5B), so it reads the same in both themes. */}
                <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="flex items-center justify-center p-4 bg-background/10 backdrop-blur-sm rounded-full shadow-sm border border-gray-100/20"
                >
                    <SvgIcon
                        name="ownersUniverseColl"
                        width={iconSize}
                        height={iconSize}
                    />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-32 h-32 bg-primary/10 rounded-full blur-xl -z-10"
                />
            </div>

            <div className="absolute mt-44">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center font-medium text-sm text-primary"
                >
                    {text}
                    <Dots dotSize="3px" className="text-primary mt-1" />
                </motion.p>
            </div>
        </div>
    );
};
