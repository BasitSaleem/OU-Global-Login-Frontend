"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { JobProgress } from '@/types/progressTypes';
import { cn } from '@/utils/cn';
import { LoadingSpinner } from './loading';

interface ProgressTrackerProps {
  progress: JobProgress | null;
  isConnected?: boolean;
  isConnecting?: boolean;
  error?: string | null;
  className?: string;
  onRetry?: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  isConnected = false,
  isConnecting = false,
  error,
  className,
  onRetry
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-[#795CF5]" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'in-progress':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <LoadingSpinner size={6} />
          </motion.div>
        );
      case 'queued':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#795CF5]';
      case 'failed':
        return 'text-red-600';
      case 'in-progress':
        return 'text-[#9685e2]';
      case 'queued':
        return 'text-amber-600';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#795CF5]';
      case 'failed':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-[#9685e2]';
      case 'queued':
        return 'bg-amber-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {isConnecting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <LoadingSpinner size={4} />
              </motion.div>
              <span className="text-sm ">Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <Wifi className={`w-4 h-4 text-blue-500  ${progress?.status === 'completed' ? "" : "animate-pulse"}`} />
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 " />
              <span className="text-sm">Disconnected</span>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="ml-2 text-xs text-[#795CF5] hover:underline"
                >
                  Retry
                </button>
              )}
            </>
          )}
        </div>

        {progress && (
          <div className="text-right">
            <p className="text-sm ">
              {/* Step {progress.currentStepNumber} of {progress.totalSteps} */}
            </p>
            <p className="text-xs">
              {progress.subDomainName}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Connection Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {progress ? (
        <div className="space-y-6">
          <div className="bg-background rounded-xl border  p-6">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(progress.status)}
              <div className="flex-1">
                <h3 className={cn("text-lg font-semibold", getStatusColor(progress.status))}>
                  {progress.status === 'completed' ? 'Registration Complete!' :
                    progress.status === 'failed' ? 'Registration Failed' :
                      progress.status === 'queued' ? 'Queued for Processing' :
                        'Processing Registration...'}
                </h3>
                <p className="text-sm mt-1">
                  {/* {progress.message} */}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span >Progress</span>
                <span className={cn("font-medium", getStatusColor(progress.status))}>
                  {progress.progress}%
                </span>
              </div>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <motion.div
                  className={cn("h-2 rounded-full", getProgressColor(progress.status))}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>


            {/* Error Message (if failed) */}
            {progress.status === 'failed' && progress.errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-800 font-medium text-sm mb-1">An error Occurred</p>
                {/* <p className="text-red-700 text-sm">{progress.errorMessage}</p> */}
              </motion.div>
            )}
          </div>
          {/* Timestamps */}
          <div className="text-xs text-center space-y-1">
            <p>Started: {new Date(progress.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(progress.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        /* Loading State */
        <div className="bg-bg-secondary rounded-xl border p-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <LoadingSpinner size={8} />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">
            Initializing Registration
          </h3>
          <p >
            Setting up your organization registration...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;