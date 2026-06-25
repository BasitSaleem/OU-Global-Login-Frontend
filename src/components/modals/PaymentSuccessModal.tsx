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
}) => {
  const router = useRouter();
  const { orgId } = useParams();
  const [countdown, setCountdown] = React.useState(5);

  const handleDone = React.useCallback(() => {
    onClose();
    router.replace(`/organization-details/${orgId}/billing`);
  }, [onClose, router, orgId]);

  React.useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && countdown === 0) {
      handleDone();
    }
  }, [isOpen, countdown, handleDone]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", damping: 25, stiffness: 300 },
            }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden p-8 pt-12"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/70 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/70 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="text-center relative z-10 space-y-6">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="relative flex items-center justify-center w-28 h-28"
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-xl">
                    <defs>
                      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50 0L58.5 12.5L73.5 8.5L77.5 23.5L91.5 28.5L87.5 43.5L100 50L87.5 56.5L91.5 71.5L77.5 76.5L73.5 91.5L58.5 87.5L50 100L41.5 87.5L26.5 91.5L22.5 76.5L8.5 71.5L12.5 56.5L0 50L12.5 43.5L8.5 28.5L22.5 23.5L26.5 8.5L41.5 12.5L50 0Z"
                      fill="url(#iconGradient)"
                    />
                  </svg>
                  <Check size={48} color="white" strokeWidth={4} className="relative z-10" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
                <p className="text-sm text-gray-500 px-4 leading-relaxed">
                  Thanks for your purchase. Your subscriptions to the <span className="font-bold text-gray-700">{planName}</span> is now active.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleDone}
                  className="w-full py-6 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold flex items-center justify-center gap-2 group transition-all"
                >
                  Return to Billing
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;
