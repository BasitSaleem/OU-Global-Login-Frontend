'use client';

import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CustomPhoneInputProps {
    value?: string;
    onChange: (value: string, country: any) => void;
    label?: string;
    isRequired?: boolean;
    disabled?: boolean;
    error?: string;
    placeholder?: string;
    country?: string;
    enableSearch?: boolean;
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
    value,
    onChange,
    label,
    isRequired = false,
    disabled = false,
    error,
    placeholder = 'Enter phone number',
    country = 'us',
    enableSearch = true,
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className={`
        relative transition-all duration-200
        ${error ? 'ring-1 ring-red-500' : 'focus-within:ring-1 focus-within:ring-blue-500'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}>
                <PhoneInput
                    country={country}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    enableSearch={enableSearch}
                    searchPlaceholder="Search countries..."
                    inputClass={`
            !w-full !h-10 !px-3 !py-2 !border !border-gray-300 !rounded-md
            !bg-white !text-gray-900 !text-sm
            focus:!border-blue-500 focus:!ring-1 focus:!ring-blue-500
            transition-colors duration-200
            ${error ? '!border-red-500 !ring-red-500' : ''}
            ${disabled ? '!bg-gray-100 !cursor-not-allowed' : ''}
          `}
                    buttonClass={`
            !border !border-gray-300 !border-r-0 !rounded-l-md
            !bg-white hover:!bg-gray-50
            ${error ? '!border-red-500 !bg-red-50' : ''}
            ${disabled ? '!bg-gray-100 !cursor-not-allowed' : ''}
          `}
                    dropdownClass="!border !border-gray-200 !shadow-lg !rounded-md !mt-1"
                    searchClass="!border-b !border-gray-200 !p-2 !mb-0"
                    containerClass=""
                    inputStyle={{
                        width: '100%',
                        borderLeft: 'none',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                    buttonStyle={{
                        borderRight: 'none',
                        backgroundColor: 'white',
                    }}
                    countryCodeEditable={false}
                    autoFormat={true}
                    masks={{ us: '(...) ...-....' }}
                    priority={{
                        us: 0,
                        gb: 1,
                        ca: 2,
                        au: 3,
                        de: 4,
                        fr: 5,
                        it: 6,
                        es: 7,
                        jp: 8,
                        kr: 9,
                        cn: 10,
                        in: 11,
                        br: 12,
                        mx: 13
                    }}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomPhoneInput;