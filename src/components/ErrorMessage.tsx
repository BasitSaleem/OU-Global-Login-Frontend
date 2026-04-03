import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again later.",
  className = "",
}) => {
  return (
    <div
      className={`
        flex items-center gap-2 p-4 text-sm border rounded-lg
        bg-red-50 text-red-800 border-red-300
        dark:bg-transparent dark:text-red-400 dark:border-red-800
        ${className}
      `}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="sr-only">Error</span>
      <div>{message}</div>
    </div>
  );
};

export default ErrorMessage;
