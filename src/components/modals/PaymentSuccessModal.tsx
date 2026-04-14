"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "../ui";
import { useRouter, useParams } from "next/navigation";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName?: string;
    amount?: string;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
    isOpen,
    onClose,
    planName = "Pro Plan",
    amount,
}) => {
    const router = useRouter();
    const { orgId } = useParams();

    const handleDone = () => {
        onClose();
        router.push(`/organization-details/${orgId}/billing`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }
                        }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative w-full max-w-md bg-bg-secondary rounded-[32px] shadow-2xl border border-border overflow-hidden"
                    >
                        {/* Animated Celebration Particles (Subtle) */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0.5],
                                        x: [0, (i % 2 === 0 ? 1 : -1) * (40 + i * 20)],
                                        y: [0, -60 - i * 10]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "easeOut"
                                    }}
                                    className={`absolute left-1/2 top-1/2 w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#1AD1B9]' : i % 3 === 1 ? 'bg-primary' : 'bg-[#5588DF]'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="p-8 text-center relative z-10">
                            {/* Success Icon Animation */}
                            <div className="flex justify-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 12,
                                        stiffness: 200,
                                        delay: 0.2
                                    }}
                                    className="relative flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-[#1AD1B9]/20 to-[#716AE2]/20 shadow-inner"
                                >
                                    <motion.div
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="absolute inset-0 rounded-full border-4 border-[#1AD1B9]"
                                        style={{
                                            clipPath: 'circle(50% at 50% 50%)',
                                        }}
                                    />
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            damping: 10,
                                            stiffness: 300,
                                            delay: 0.6
                                        }}
                                        className="flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-[#1AD1B9] to-[#716AE2] text-white shadow-lg"
                                    >
                                        <Check size={32} strokeWidth={3} />
                                    </motion.div>
                                </motion.div>
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-2xl font-bold text-text mb-2"
                            >
                                Payment Successful!
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-text/70 text-sm mb-8 px-4"
                            >
                                Thank you for your purchase. Your subscription to the <span className="font-bold text-text">{planName}</span> is now active.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="space-y-3"
                            >
                                <Button
                                    onClick={handleDone}
                                    className="w-full py-6 rounded-2xl bg-linear-to-r from-[#1AD1B9] to-primary hover:opacity-90 transition-opacity font-bold text-lg text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    Return to Billing
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.span>
                                </Button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-2 text-text/50 hover:text-text text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentSuccessModal;