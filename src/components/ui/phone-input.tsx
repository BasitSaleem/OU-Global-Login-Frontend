'use client';

import React, { forwardRef } from 'react';
import PhoneInput2 from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/utils/helpers';
import { Asterisk, Lock } from 'lucide-react';
import { PermissionGuard } from '@/components/HOCs/permission-guard';
import { Permission } from '@/types/common';

export interface PhoneInputProps {
    className?: string;
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    helperText?: string;
    isRequired?: boolean;
    disabled?: boolean;
    permission?: Permission | Permission[];
    checkAllPermissions?: boolean;
    permissionFallback?: React.ReactNode;
    placeholder?: string;
    country?: string;
}

const PhoneInput = forwardRef<any, PhoneInputProps>(
    (
        {
            className,
            value,
            onChange,
            label,
            error,
            helperText,
            isRequired,
            disabled,
            permission,
            checkAllPermissions = false,
            permissionFallback,
            placeholder,
            country = 'us',
            ...props
        },
        ref
    ) => {

        // Locked/Disabled Input for permission fallback
        const renderLockedInput = () => (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm text-text ml-1">
                        {isRequired ? (
                            <>
                                {label}
                                <Asterisk className="inline ml-1 mb-2" width={14} height={14} color="red" />
                            </>
                        ) : (
                            label
                        )}
                        <Lock className="inline ml-2 mb-1" width={14} height={14} color="#6B7280" />
                    </label>
                )}
                <div className="relative">
                    <input
                        disabled
                        value={value}
                        className="flex h-10 w-full mt-1.5 text-gray-500 rounded-lg border bg-gray-100 px-3 py-2 text-sm cursor-not-allowed opacity-50"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                </div>
                <p className="text-sm text-gray-500">No permission to edit this field</p>
            </div>
        );

        const content = (
            <div className={cn("space-y-2", className)}>
                {label && (
                    <label className="text-sm text-text ml-1 block">
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
                <div className={cn("relative group", disabled && "opacity-50 cursor-not-allowed")}>
                    <PhoneInput2
                        country={country}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        enableSearch={true}
                        disableSearchIcon={true}
                        searchClass="!p-2 !bg-white !text-gray-900 !rounded-t-lg"
                        dropdownClass="!bg-white !text-gray-900 !border-gray-200 !shadow-lg !rounded-lg"
                        inputProps={{
                            ref: ref,
                            required: isRequired,
                        }}
                        inputClass={cn(
                            "!w-full !h-10 !text-sm !pl-12 !pr-3 !bg-input-bg !text-text !rounded-lg !border focus:!outline-none focus:!ring-1 focus:!ring-primary hover:!border-primary/50 transition-colors",
                            error ? "!border-red-500 focus:!ring-red-500" : "!border-gray-200 !border",
                            disabled ? "!bg-gray-100 !cursor-not-allowed !opacity-50" : ""
                        )}
                        buttonClass={cn(
                            "!border-0 !bg-transparent !rounded-l-lg hover:!bg-transparent !placeholder-gray-400",
                            disabled ? "!cursor-not-allowed" : ""
                        )}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );

        if (permission) {
            return (
                <PermissionGuard
                    requiredPermissions={permission}
                    checkAll={checkAllPermissions}
                    fallback={permissionFallback || renderLockedInput()}
                >
                    {content}
                </PermissionGuard>
            )
        }

        return content;
    }
);

PhoneInput.displayName = "PhoneInput";
export { PhoneInput };