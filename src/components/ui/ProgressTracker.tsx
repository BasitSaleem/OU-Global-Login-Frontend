"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { JobProgress, getStepDisplayName, LEAD_REGISTRATION_STEPS } from '@/types/progressTypes';
import { cn } from '@/utils/cn';

interface ProgressTrackerProps {
  progress: JobProgress | null;
  isConnected?: boolean;
  isConnecting?: boolean;
  error?: string | null;
  className?: string;
  showDetailedSteps?: boolean;
  onRetry?: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  isConnected = false,
  isConnecting = false,
  error,
  className,
  showDetailedSteps = true,
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
            <Loader2 className="w-6 h-6 text-[#795CF5]" />
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
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {isConnecting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-4 h-4 text-[#795CF5]" />
              </motion.div>
              <span className="text-sm text-gray-600">Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-blue-500" />
              {/* <span className="text-sm text-green-600">Live  connected</span> */}
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Disconnected</span>
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
            <p className="text-sm text-gray-600">
              {/* Step {progress.currentStepNumber} of {progress.totalSteps} */}
            </p>
            <p className="text-xs text-gray-500">
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
          {/* Main Progress Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(progress.status)}
              <div className="flex-1">
                <h3 className={cn("text-lg font-semibold", getStatusColor(progress.status))}>
                  {progress.status === 'completed' ? 'Registration Complete!' :
                   progress.status === 'failed' ? 'Registration Failed' :
                   progress.status === 'queued' ? 'Queued for Processing' :
                   'Processing Registration...'}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {progress.message}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className={cn("font-medium", getStatusColor(progress.status))}>
                  {progress.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={cn("h-2 rounded-full", getProgressColor(progress.status))}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Current Step */}
            {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Current Step:</p>
              <p className="text-gray-600">
                {getStepDisplayName(progress.currentStep)}
              </p>
            </div> */}

            {/* Error Message (if failed) */}
            {progress.status === 'failed' && progress.errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-800 font-medium text-sm mb-1">Error Details:</p>
                <p className="text-red-700 text-sm">{progress.errorMessage}</p>
              </motion.div>
            )}
          </div>

          {showDetailedSteps && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Registration Steps
              </h4>
              <div className="space-y-3">
                {LEAD_REGISTRATION_STEPS.filter(step => step.name !== 'QUEUED').map((step, index) => {
                  const isCompleted = progress.currentStepNumber > step.order;
                  const isCurrent = progress.currentStepNumber === step.order;
                  const isPending = progress.currentStepNumber < step.order;
                  
                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        isCurrent && "bg-[#795CF5]/5 border border-[#795CF5]/20",
                        isCompleted && "bg-[#795CF5]",
                        isPending && "bg-gray-50"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-5 h-5 text-[#795CF5]" />
                          </motion.div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          isCurrent && "text-[#795CF5]",
                          isCompleted && "text-blue-700",
                          isPending && "text-gray-500"
                        )}>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Started: {new Date(progress.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(progress.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        /* Loading State */
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 className="w-8 h-8 text-[#795CF5]" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Initializing Registration
          </h3>
          <p className="text-gray-600">
            Setting up your organization registration...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;