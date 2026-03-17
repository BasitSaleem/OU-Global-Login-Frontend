import React from 'react';
import { Dots } from './Dots';

interface GoogleButtonProps {
    onClick?: () => void;
    text: string;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, text, className, disabled, isLoading }) => {
    const googleSignIn = () => {
        const query = {
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
            response_type: "code",
            scope: process.env.NEXT_PUBLIC_GOOGLE_SCOPES!,
        };
        const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        url.search = new URLSearchParams(query).toString();
        window.location.href = url.toString()
    }
    return (
        <button
            onClick={onClick || googleSignIn}
            disabled={disabled}
            className={`
        relative group flex items-center justify-center 
        h-[40px] px-[12px] min-w-max w-full
        border border-border rounded-full
        text-text text-[14px] font-bold tracking-[0.25px]
        select-none appearance-none overflow-hidden
        transition-all duration-[0.218s]
        bg-google-button
        disabled:bg-google-button disabled:border-border disabled:cursor-default cursor-pointer
        ${className}
      `}
        >
            <div className="absolute inset-0 bg-google-button opacity-0 transition-opacity duration-[0.218s] group-hover:not-disabled:opacity-[0.08] group-focus:not-disabled:opacity-[0.12] group-active:not-disabled:opacity-[0.12]"></div>

            <div className="relative flex items-center justify-between w-full h-full whitespace-nowrap">
                <div className="flex items-center justify-center w-[20px] h-[20px] mr-[12px] shrink-0 group-disabled:opacity-[0.38]">
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        className="block w-full h-full"
                    >
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span className="flex-grow text-sm font-medium transition-opacity duration-[0.218s] group-disabled:opacity-[0.38] text-center">
                    {text}
                    {isLoading && <Dots dotSize="4px" className=" gap-1" />}
                </span>

            </div>
        </button>
    );
};

export default GoogleButton;
