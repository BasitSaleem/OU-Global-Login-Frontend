"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (otp: string) => void;
    error?: string;
    className?: string;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    error,
    className,
}: OTPInputProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus the first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        // Only allow digits
        if (!/^\d*$/.test(newValue)) return;

        // Update the OTP value
        const newOtp = value.split("");
        newOtp[index] = newValue.charAt(newValue.length - 1); // Take only the last character
        const joinedOtp = newOtp.join("");

        onChange(joinedOtp);

        // Auto-focus next input
        if (newValue && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            if (!value[index] && index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = value.split("");
                newOtp[index] = "";
                onChange(newOtp.join(""));
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData("text").slice(0, length);

        if (/^\d+$/.test(pastedData)) {
            onChange(pastedData);
            const nextIndex = Math.min(pastedData.length, length - 1);
            setActiveIndex(nextIndex);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className={className}>
            <div className="flex justify-center gap-2 sm:gap-3">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={value[index] || ""}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => handleFocus(index)}
                        className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors",
                            "bg-bg-secondary/85 border",
                            "focus:border-primary focus:ring- focus:ring-primary",
                            activeIndex === index && "border-primary ring-1 ring-primary",
                            error && "border-red-500"
                        )}
                    />
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
            )}
        </div>
    );
}