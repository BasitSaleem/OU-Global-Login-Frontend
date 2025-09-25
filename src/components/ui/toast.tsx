'use client';

import React from 'react';
import { toast as reactToast, ToastContent, ToastOptions, Id } from 'react-toastify';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { BRAND_COLORS } from '@/constants/brand';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Custom toast component interface
interface CustomToastProps {
  type: ToastType;
  title: string;
  message?: string;
  logo?: React.ReactNode;
  onClose?: () => void;
}

// Logo component - you can replace this with your actual logo
const DefaultLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ${className}`}>
    OU
  </div>
);

// Toast icons mapping
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

// Toast colors mapping
const toastStyles: Record<ToastType, {
  iconColor: string;
  borderColor: string;
  bgColor: string;
}> = {
  success: {
    iconColor: 'text-green-500',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
  },
  error: {
    iconColor: 'text-red-500',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50',
  },
  warning: {
    iconColor: 'text-orange-500',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50',
  },
  info: {
    iconColor: 'text-blue-500',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
  },
};

// Custom toast component
const CustomToast: React.FC<CustomToastProps> = ({ 
  type, 
  title, 
  message, 
  logo, 
  onClose 
}) => {
  const styles = toastStyles[type];
  const icon = toastIcons[type];

  return (
    <div className={`
      relative flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
      ${styles.borderColor} ${styles.bgColor}
      animate-toast-slide-in w-[inherit]
    `}>
      {/* Logo */}
      {/* <div className="flex-shrink-0 mt-0.5">
        {logo || <DefaultLogo />}
      </div> */}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-5 truncate">
                {title}
              </h4>
              {message && (
                <p className="mt-1 text-sm text-gray-700 leading-5">
                  {message}
                </p>
              )}
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast configuration
const defaultToastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    padding: 0,
    background: 'transparent',
    boxShadow: 'none',
  },

  closeButton: false, // We'll use our custom close button
};

// Toast utility functions
export const toast = {
  success: (title: string, message?: string, options?: Partial<ToastOptions & { logo?: React.ReactNode }>): Id => {
    const { logo, ...toastOptions } = options || {};
    return reactToast(
      ({ closeToast }) => (
        <CustomToast
          type="success"
          title={title}
          message={message}
          logo={logo}
          onClose={closeToast}
        />
      ),
      { ...defaultToastConfig, ...toastOptions }
    );
  },

  error: (title: string, message?: string, options?: Partial<ToastOptions & { logo?: React.ReactNode }>): Id => {
    const { logo, ...toastOptions } = options || {};
    return reactToast(
      ({ closeToast }) => (
        <CustomToast
          type="error"
          title={title}
          message={message}
          logo={logo}
          onClose={closeToast}
        />
      ),
      { ...defaultToastConfig, ...toastOptions }
    );
  },

  warning: (title: string, message?: string, options?: Partial<ToastOptions & { logo?: React.ReactNode }>): Id => {
    const { logo, ...toastOptions } = options || {};
    return reactToast(
      ({ closeToast }) => (
        <CustomToast
          type="warning"
          title={title}
          message={message}
          logo={logo}
          onClose={closeToast}
        />
      ),
      { ...defaultToastConfig, ...toastOptions }
    );
  },

  info: (title: string, message?: string, options?: Partial<ToastOptions & { logo?: React.ReactNode }>): Id => {
    const { logo, ...toastOptions } = options || {};
    return reactToast(
      ({ closeToast }) => (
        <CustomToast
          type="info"
          title={title}
          message={message}
          logo={logo}
          onClose={closeToast}
        />
      ),
      { ...defaultToastConfig, ...toastOptions }
    );
  },

  // Generic toast with custom content
  custom: (content: ToastContent, options?: ToastOptions): Id => {
    return reactToast(content, { ...defaultToastConfig, ...options });
  },

  // Utility methods
  dismiss: (toastId?: Id) => reactToast.dismiss(toastId),
  isActive: (toastId: Id) => reactToast.isActive(toastId),
};

// Hook for using toast
export const useToast = () => {
  return toast;
};

export default CustomToast;