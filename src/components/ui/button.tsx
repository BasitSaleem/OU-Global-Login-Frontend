import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';
import { Loader2 } from 'lucide-react';
import { LoadingSpinner } from './loading';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex  cursor-pointer items-center justify-center gap-1.5 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-[#795CF5] text-white hover:bg-[#7C3AED] focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600'
    };

    const sizes = {
      sm: 'h-6 px-2 text-body-small',
      md: 'h-7 px-3 text-body-medium',
      lg: 'h-8 px-4 text-body-medium',
      xl: 'h-9 px-5 text-body-large'
    };

    return (
      <button
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
  }
);

Button.displayName = 'Button';

export { Button };
