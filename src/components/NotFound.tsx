import React from "react";
import { SearchX } from "lucide-react";

interface NotFoundProps {
  title?: string;
  description?: string;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Not Found",
  description = "The resource you are looking for does not exist or may have been removed.",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center ${className}`}
    >
      <div className="flex items-center justify-center bg-gray w-20 h-20 rounded-full">
        <SearchX className="w-10 h-10 text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <p className="text-sm text-text max-w-xs">{description}</p>
      </div>
    </div>
  );
};

export default NotFound;
