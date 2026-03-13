
"use client"
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/helpers";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="flex items-start gap-2 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                        <input
                            type="checkbox"
                            className={cn(
                                "peer h-4 w-4 shrink-0 rounded border border-primary bg-transparent text-primary focus:ring-1 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                                error && "border-red-500",
                                className
                            )}
                            ref={ref}
                            {...props}
                        />
                    </div>
                    {label && (
                        <span className="text-xs sm:text-sm text-text font-medium select-none">
                            {label}
                        </span>
                    )}
                </label>
                {error && (
                    <p className="text-[10px] sm:text-xs text-red-600 ml-6">{error}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
