'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        limit={5} // Maximum number of toasts to display
        className="toast-container"
        toastClassName="toast-item"

        style={{
          '--toastify-toast-width': '420px',
          '--toastify-toast-min-height': '64px',
        } as React.CSSProperties}
      />

      {/* Custom CSS for animations and styling */}
      <style jsx global>{`
        .toast-container {
          width: auto !important;
          max-width: 420px;
          z-index: 9999;
        }
        
        .toast-item {
          padding: 0 !important;
          margin-bottom: 12px !important;
          border-radius: 8px !important;
          background: transparent !important;
          box-shadow: none !important;
          min-height: auto !important;
        }
        
        .toast-body {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .toast-progress {
          height: 3px !important;
          background: linear-gradient(90deg, #795cf5 0%, #a855f7 100%) !important;
        }
        
        /* Custom animations */
        @keyframes toast-slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes toast-slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-toast-slide-in {
          animation: toast-slide-in 0.3s ease-out;
        }
        
        .animate-toast-slide-out {
          animation: toast-slide-out 0.3s ease-in;
        }
        
        /* Hover effects */
        .toast-item:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease-in-out;
        }
        
        /* Focus styles for accessibility */
        .toast-item:focus-within {
          outline: 2px solid #795cf5;
          outline-offset: 2px;
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .toast-container {
            --toastify-color-light: #1f2937;
            --toastify-color-dark: #111827;
            --toastify-color-info: #3b82f6;
            --toastify-color-success: #10b981;
            --toastify-color-warning: #f59e0b;
            --toastify-color-error: #ef4444;
          }
        }
        
        /* Responsive design */
        @media (max-width: 640px) {
          .toast-container {
            left: 16px !important;
            right: 16px !important;
            top: 16px !important;
            max-width: calc(100vw - 32px) !important;
          }
          
          .toast-item {
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ToastProvider;