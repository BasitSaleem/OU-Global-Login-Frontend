import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';
import { LoadingSpinner } from './loading';
import { PermissionGuard } from '@/components/HOCs/permission-guard';
import { Permission } from '@/types/common';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipPosition } from './Tooltip';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | "basic";
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  permission?: Permission | Permission[];
  checkAllPermissions?: boolean;
  permissionFallback?: React.ReactNode;
  ariaLabel?: string;
  tooltip?: string | React.ReactNode;
  tooltipPosition?: TooltipPosition;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'basic',
    size = 'md',
    isLoading = false,
    ariaLabel,
    leftIcon,
    rightIcon,
    children,
    disabled,
    permission,
    checkAllPermissions = false,
    permissionFallback,
    ...props
  }, ref) => {
    const baseStyles = ' inline-flex  cursor-pointer items-center justify-center gap-1.5 rounded  transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary py-4 text-white hover:bg-primary/80 rounded-lg border border-primary',
      secondary: 'bg-bg-secondary py-4 hover:bg-primary border-primary hover:!text-btn-text border rounded-lg',
      outline: 'border border-gray-300 bg-transparent text-primary hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 py-4 hover:bg-primary/80 rounded-lg focus:ring-gray-500 border rounded-lg hover:!text-btn-text ',
      destructive: 'bg-red py-4 text-btn-text hover:bg-red-700 focus:ring-red-500 rounded-lg border-red border',
      basic: ''
    };

    const sizes = {
      sm: 'h-6 px-2 ',
      md: 'h-7 px-3 ',
      lg: 'h-8 px-4 ',
      xl: 'h-9 px-5 '
    };

    if (!permission) {
      return (
        <BaseButton
          className={className}
          variant={variant}
          size={size}
          isLoading={isLoading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          disabled={disabled}
          baseStyles={baseStyles}
          variants={variants}
          sizes={sizes}
          ref={ref}
          {...props}
        >
          {children}
        </BaseButton>
      );
    }

    return (
      <PermissionGuard
        requiredPermissions={permission}
        checkAll={checkAllPermissions}
        fallback={permissionFallback || <LockedButton variant={variant} size={size}>{children}</LockedButton>}
      >
        <BaseButton
          className={className}
          variant={variant}
          size={size}
          isLoading={isLoading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          disabled={disabled}
          baseStyles={baseStyles}
          variants={variants}
          sizes={sizes}
          ref={ref}
          {...props}
        >
          {children}
        </BaseButton>
      </PermissionGuard>
    );
  }
);

interface BaseButtonProps extends Omit<ButtonProps, 'permission' | 'checkAllPermissions' | 'permissionFallback'> {
  baseStyles: string;
  variants: Record<string, string>;
  sizes: Record<string, string>;
}

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ariaLabel,
    baseStyles,
    variants,
    sizes,
    tooltip,
    tooltipPosition,
    ...props
  }, ref) => {
    const buttonElement = (
      <button
        aria-label={ariaLabel}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className,
          isLoading ? 'pointer-events-none opacity-50 ' : ''
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner className='border-amber-50 mr-2' size={4} />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {!isLoading && rightIcon && rightIcon}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

BaseButton.displayName = "BaseButton";

interface LockedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'basic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const LockedButton = forwardRef<HTMLButtonElement, LockedButtonProps>(
  ({ variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-gray-400 py-5 !text-btn-text border-gray-400 border rounded-lg',
      secondary: 'bg-gray-300 py-4 border-gray-400 border rounded-lg',
      outline: 'border border-gray-300 bg-transparent text-gray-500',
      ghost: 'text-gray-500 py-4 rounded-lg border rounded-lg',
      destructive: 'bg-gray-400 py-4 !text-btn-text border-gray-400 border rounded-lg',
      basic: 'bg-gray-400 py-4 !text-btn-text border-gray-400 border rounded-lg'
    };

    const sizes = {
      sm: 'h-6 px-2 ',
      md: 'h-7 px-3 ',
      lg: 'h-8 px-4 ',
      xl: 'h-9 px-5 '
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          'cursor-not-allowed'
        )}
        ref={ref}
        disabled
        {...props}
      >
        <Lock className="w-4 h-4 mr-2" />
        {children}
      </button>
    );
  }
);

LockedButton.displayName = "LockedButton";

Button.displayName = 'Button';

export { Button };