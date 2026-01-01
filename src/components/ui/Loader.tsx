'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SvgIcon, IconName } from './SvgIcon';

interface LoaderProps {
    className?: string;
    iconSize?: number;
}

const ICONS: IconName[] = ["OA", 'OI', 'OJ', 'OM'];

export const Loader: React.FC<LoaderProps> = ({
    className = "",
    iconSize = 80
}) => {
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prev) => (prev + 1) % ICONS.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center justify-center w-full h-full min-h-[300px] ${className}`}>
            <div className="relative flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIconIndex}
                        initial={{ opacity: 0, scale: 0.5, y: 20, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                        transition={{
                            duration: 0.5,
                            ease: "circOut"
                        }}
                        className="absolute"
                    >
                        <div className={`flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-full shadow-sm border border-gray-100/20`}>
                            <SvgIcon
                                name={ICONS[currentIconIndex]}
                                width={iconSize}
                                height={iconSize}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
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

            {/* <div className="absolute mt-32">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="font-medium text-sm animate-pulse"
                >
                    Creating Organization...
                </motion.p>
            </div> */}
        </div>
    );
};
