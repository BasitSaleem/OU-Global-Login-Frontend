import { CheckCircle, XCircle } from "lucide-react";
import { LoadingSpinner } from "./ui";


interface AvailabilityStatusProps {
    isLoading: boolean;
    isAvailable?: boolean;
    isDebouncing: boolean;
    fieldName: string;
    value: string;
    companyName?: boolean
}


export const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
    isLoading,
    isAvailable,
    isDebouncing,
    fieldName,
    value,
    companyName,
}) => {
    if (!value) return null;

    if (isDebouncing) {
        return (
            <div className="flex items-center gap-2 mt-2 text-sm text-text">
                <LoadingSpinner size={4} className="border-text" />
                <span>Checking {fieldName} availability...</span>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                <LoadingSpinner size={4} className="border-blue-600" />
                <span>Verifying {fieldName}...</span>
            </div>
        );
    }

    if (isAvailable === true) {
        return (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{fieldName} is available</span>
            </div>
        );
    }

    if (isAvailable === false) {
        return (
            <>
                {companyName ? <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <XCircle className="w-4 h-4" />
                    <span>{fieldName} is already taken</span>
                </div> : <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <span>This site is already taken. <span className="text-gray-500">Try another one or choose from <br /> the suggestions below.</span></span>
                </div>}
            </>
        );
    }


    return null;
};