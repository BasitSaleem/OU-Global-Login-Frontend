// import { forwardRef, InputHTMLAttributes } from "react";
// import { cn } from "@/utils/helpers";
// import { Asterisk, BadgeInfo, Eye, EyeOff } from "lucide-react";
// import { useState } from "react";

// export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url" | "checkbox";
//   helperText?: string;
//   isRequired?: boolean;
//   leftIcon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
//   isPassword?: boolean;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       className,
//       type,
//       label,
//       error,
//       helperText,
//       isRequired,
//       leftIcon,
//       rightIcon,
//       isPassword = false,
//       ...props
//     },
//     ref
//   ) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const inputType = isPassword ? (showPassword ? "text" : "password") : type;

//     const baseStyles =
//       "flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary  disabled:cursor-not-allowed disabled:opacity-50 ";

//     const errorStyles = error
//       ? "border-red-500 focus:ring-red-500"
//       : "";

//     const withIconStyles = leftIcon || rightIcon || isPassword ? "pl-10" : "";

//     return (
//       <div className="space-y-2">
//         {label && (
//           <label className="text-sm  text-text ml-1 ">
//             {isRequired ? (
//               <>
//                 {label}
//                 <Asterisk className="inline ml-1 mb-2" width={14} height={14} color="red" />
//               </>
//             ) : (
//               label
//             )}
//           </label>
//         )}
//         <div className="relative">
//           {leftIcon && (
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               {leftIcon}
//             </div>
//           )}
//           <input
//             type={inputType}
//             autoComplete={type === "search" ? "off" : props.autoComplete}
//             className={cn(
//               baseStyles,
//               errorStyles,
//               leftIcon && "pl-10",
//               (rightIcon || isPassword) && "pr-10",
//               className
//             )}
//             ref={ref}
//             {...props}
//           />
//           {isPassword && (
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <EyeOff className="h-4 w-4" />
//               ) : (
//                 <Eye className="h-4 w-4" />
//               )}
//             </button>
//           )}
//           {rightIcon && !isPassword && (
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//               {rightIcon}
//             </div>
//           )}
//         </div>
//         {error && (
//           <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//         )}
//         {helperText && !error && (
//           <p className="text-sm">
//             {helperText}
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = "Input";

// export { Input };
// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/helpers";
import { Asterisk, BadgeInfo, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { PermissionGuard } from "@/components/HOCs/permission-guard";
import { Permission } from "@/types/common";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url" | "checkbox";
  helperText?: string;
  isRequired?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  permission?: Permission | Permission[];
  checkAllPermissions?: boolean;
  permissionFallback?: React.ReactNode;
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
      permission,
      checkAllPermissions = false,
      permissionFallback,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const baseStyles =
      "flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

    const errorStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "";

    const disabledStyles = props.disabled
      ? "bg-gray-100 text-gray-500 border-gray-300"
      : "";

    if (!permission) {
      return (
        <BaseInput
          label={label}
          error={error}
          helperText={helperText}
          isRequired={isRequired}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          isPassword={isPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          inputType={inputType ?? ""}
          baseStyles={baseStyles}
          errorStyles={errorStyles}
          disabledStyles={disabledStyles}
          className={className}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <PermissionGuard
        requiredPermissions={permission}
        checkAll={checkAllPermissions}
        fallback={permissionFallback || <LockedInput {...props} label={label} isRequired={isRequired} />}
      >
        <BaseInput
          label={label}
          error={error}
          helperText={helperText}
          isRequired={isRequired}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          isPassword={isPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          inputType={inputType ?? ""}
          baseStyles={baseStyles}
          errorStyles={errorStyles}
          disabledStyles={disabledStyles}
          className={className}
          ref={ref}
          {...props}
        />
      </PermissionGuard>
    );
  }
);

interface BaseInputProps extends Omit<InputProps, 'permission' | 'checkAllPermissions' | 'permissionFallback'> {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  inputType: string;
  baseStyles: string;
  errorStyles: string;
  disabledStyles: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      isRequired,
      leftIcon,
      rightIcon,
      isPassword = false,
      showPassword,
      setShowPassword,
      inputType,
      baseStyles,
      errorStyles,
      disabledStyles,
      ...props
    },
    ref
  ) => {
    return (
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
            autoComplete={inputType === "search" ? "off" : props.autoComplete}
            className={cn(
              baseStyles,
              errorStyles,
              disabledStyles,
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70"
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
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";
const LockedInput = forwardRef<HTMLInputElement, { label?: string; isRequired?: boolean } & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, isRequired, ...props }, ref) => {
    return (
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
            {...props}
            ref={ref}
            disabled
            className="flex h-10 w-full mt-1.5 text-gray-500 rounded-lg border bg-gray-100 px-3 py-2 text-sm cursor-not-allowed opacity-50"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Lock className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500">No permission to edit this field</p>
      </div>
    );
  }
);

LockedInput.displayName = "LockedInput";

Input.displayName = "Input";

export { Input };
