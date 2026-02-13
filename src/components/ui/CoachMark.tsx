"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./index";
import { X, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface CoachMarkStep {
    target: string;
    title: string;
    description: string;
    position?: "top" | "bottom" | "left" | "right" | "center";
}

interface CoachMarkBubbleProps {
    isVisible: boolean;
    step: CoachMarkStep;
    currentStepIndex: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
}

const CoachMarkBubble: React.FC<CoachMarkBubbleProps> = ({
    isVisible,
    step,
    currentStepIndex,
    totalSteps,
    onNext,
    onBack,
    onSkip,
}) => {
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [bubblePos, setBubblePos] = useState({ top: 0, left: 0 });
    const [actualPosition, setActualPosition] = useState(step.position || "bottom");
    const [isMobile, setIsMobile] = useState(false);
    const bubbleRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
        const targetEl = document.querySelector(step.target) as HTMLElement;
        if (!targetEl) return;

        const rect = targetEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mobileThreshold = 768;
        const isMobileScreen = viewportWidth < mobileThreshold;
        const padding = 16;

        setIsMobile(isMobileScreen);

        setCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });

        const bubbleWidth = isMobileScreen ? Math.min(viewportWidth - (padding * 2), 340) : 360;
        const bubbleHeight = 220;
        const offset = 150;

        // 1. Determine best position based on screen space
        let pos = step.position || "bottom";

        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;

        if (pos === "top" && spaceAbove < bubbleHeight + offset && spaceBelow > spaceAbove) pos = "bottom";
        if (pos === "bottom" && spaceBelow < bubbleHeight + offset && spaceAbove > spaceBelow) pos = "top";
        if (pos === "left" && spaceLeft < bubbleWidth + offset && spaceRight > spaceLeft) pos = "right";
        if (pos === "right" && spaceRight < bubbleWidth + offset && spaceLeft > spaceRight) pos = "left";

        if (isMobileScreen || (spaceLeft < bubbleWidth && spaceRight < bubbleWidth && spaceAbove < bubbleHeight && spaceBelow < bubbleHeight)) {
            if (pos === "left" || pos === "right") pos = "bottom";
            if (viewportWidth < 400) pos = "center";
        }

        setActualPosition(pos);

        let t = 0;
        let l = 0;

        switch (pos) {
            case "top":
                t = rect.top - offset - bubbleHeight / 2;
                l = rect.left + rect.width / 2;
                break;

            case "bottom":
                t = rect.bottom + offset + bubbleHeight / 2;
                l = rect.left + rect.width / 2;
                break;

            case "left":
                t = rect.top + rect.height / 2;
                l = rect.left - offset - bubbleWidth / 2;
                break;

            case "right":
                t = rect.top + rect.height / 2;
                l = rect.right + offset + bubbleWidth / 2;
                break;

            case "center":
                t = viewportHeight / 2;
                l = viewportWidth / 2;
                break;
        }


        // 2. Strict Clamping Logic
        // For top/bottom/center, l is the center of the bubble
        // For left, l is the right edge of the bubble
        // For right, l is the left edge of the bubble

        if (pos === "top" || pos === "bottom" || pos === "center") {
            const minL = padding + bubbleWidth / 2;
            const maxL = viewportWidth - padding - bubbleWidth / 2;
            l = Math.max(minL, Math.min(maxL, l));
        } else if (pos === "left") {
            const minL = padding + bubbleWidth + offset;
            const maxL = viewportWidth - padding;
            l = Math.max(minL, Math.min(maxL, l));
        } else if (pos === "right") {
            const minL = padding;
            const maxL = viewportWidth - padding - bubbleWidth - offset;
            l = Math.max(minL, Math.min(maxL, l));
        }

        // Vertical clamping
        if (pos === "left" || pos === "right" || pos === "center") {
            const minT = padding + (pos === "center" ? 0 : bubbleHeight / 2);
            const maxT = viewportHeight - padding - (pos === "center" ? 0 : bubbleHeight / 2);
            t = Math.max(minT, Math.min(maxT, t));
        } else {
            const minT = padding + bubbleHeight / 2;
            const maxT = viewportHeight - padding - bubbleHeight / 2;
            t = Math.max(minT, Math.min(maxT, t));
        }

        setBubblePos({ top: t, left: l });
    }, [step]);

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            const interval = setInterval(updatePosition, 500);
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition);
            return () => {
                clearInterval(interval);
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition);
            };
        }
    }, [isVisible, updatePosition]);

    if (!isVisible) return null;

    const getTranslate = () => {
        if (actualPosition === "center") return "translate(-50%, -50%)";
        switch (actualPosition) {
            case "top": return "translate(-50%, -100%)";
            case "bottom": return "translate(-50%, 0%)";
            case "left": return "translate(-100%, -50%)";
            case "right": return "translate(0%, -50%)";
            default: return "translate(-50%, 0%)";
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden font-inter">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 pointer-events-auto"
                onClick={onSkip}
                style={{
                    clipPath: actualPosition === "center" ? "none" : `polygon(
            0% 0%, 
            0% 100%, 
            ${coords.left - 4}px 100%, 
            ${coords.left - 4}px ${coords.top - 4}px, 
            ${coords.left + coords.width + 4}px ${coords.top - 4}px, 
            ${coords.left + coords.width + 4}px ${coords.top + coords.height + 4}px, 
            ${coords.left - 4}px ${coords.top + coords.height + 4}px, 
            ${coords.left - 4}px 100%, 
            100% 100%, 
            100% 0%
          )`,
                }}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    ref={bubbleRef}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute bg-white dark:bg-bg-secondary rounded-2xl shadow-2xl p-6 w-[calc(100vw-32px)] sm:w-[360px] pointer-events-auto border border-white/20"
                    style={{
                        top: bubblePos.top,
                        left: bubblePos.left,
                        transform: getTranslate(),
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <Logo width={100} height={30} Icon="ownersUniverse" />
                        <Button
                            onClick={onSkip}
                            className="p-1.5 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400 hover:text-primary transition-all duration-300" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-6">
                        <h3 className="text-heading-1 font-bold text-black dark:text-white leading-tight">
                            {step.title}
                        </h3>
                        <p className="text-body-small text-gray-500 dark:text-gray-400 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? "w-6 bg-primary" : "w-1.5 bg-gray-200 dark:bg-gray-700"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {currentStepIndex > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onBack}
                                    className="h-9 px-3 text-primary"
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={onNext}
                                className="h-9 px-5"
                            >
                                {currentStepIndex === totalSteps - 1 ? "Get Started" : "Next"}
                                {currentStepIndex !== totalSteps - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                            </Button>
                        </div>
                    </div>

                    {actualPosition !== "center" && !isMobile && (
                        <div
                            className={`absolute w-3 h-3 bg-white rotate-45 border-white/20
                ${actualPosition === "bottom" ? "-top-1.5 left-1/2 -translate-x-1/2 border-t border-l" : ""}
                ${actualPosition === "top" ? "-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r" : ""}
                ${actualPosition === "left" ? "-right-1.5 top-1/2 -translate-y-1/2 border-t border-r" : ""}
                ${actualPosition === "right" ? "-left-1.5 top-1/2 -translate-y-1/2 border-b border-l" : ""}
              `}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export interface CoachMarkTourProps {
    steps: CoachMarkStep[];
    run: boolean;
    onFinish?: () => void;
    onSkip?: () => void;
}

export const CoachMarkTour: React.FC<CoachMarkTourProps> = ({
    steps,
    run,
    onFinish,
    onSkip,
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!run) setCurrentStep(0);
    }, [run]);

    if (!run || steps.length === 0) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish?.();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <CoachMarkBubble
            isVisible={run}
            step={steps[currentStep]}
            currentStepIndex={currentStep}
            totalSteps={steps.length}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={() => onSkip?.()}
        />
    );
};
