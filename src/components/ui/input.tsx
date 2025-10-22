import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/helpers";
import { Asterisk, BadgeInfo, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url" | "checkbox";
  helperText?: string;
  isRequired?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      isRequired,
      leftIcon,
      rightIcon,
      isPassword = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const baseStyles =
      "flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary  disabled:cursor-not-allowed disabled:opacity-50 ";

    const errorStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "";

    const withIconStyles = leftIcon || rightIcon || isPassword ? "pl-10" : "";

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm  text-text ml-1 ">
            {isRequired ? (
              <>
                {label}
                <Asterisk className="inline ml-1 mb-2" width={14} height={14} color="red" />
              </>
            ) : (
              label
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            autoComplete={type === "search" ? "off" : props.autoComplete}
            className={cn(
              baseStyles,
              errorStyles,
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
