"use client";
import React, { useCallback, useEffect, } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressTracker } from './ProgressTracker';
import { useCreateOrganizationProgress } from '@/hooks/useProgressTracking';
import { CreateOrganizationResponse } from '@/apiHooks.ts/organization/organization.types';
import { Button } from './button';
import { useAppDispatch } from "@/redux/store";
import { setOrganization } from '@/redux/slices/auth.slice';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/useToast';
import { useScrollLock } from '@/hooks/useScrollLock';
import { ROUTES } from '@/constants';

interface ProgressModalProps {
  isOpen: boolean;
  organizationData: CreateOrganizationResponse | null;
  onClose: () => void;
  onComplete?: () => void;
  onGoHome?: () => void;
  isFromMain: boolean;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  organizationData,
  onClose,
  onComplete,
  onGoHome,
  isFromMain
}) => {
  const dispatch = useAppDispatch()
  useScrollLock(isOpen)
  const router = useRouter()
  const handleProgress = useCallback((progress: any) => {
    console.log("Progress update:", progress);
  }, []);

  const handleComplete = useCallback(
    (progress: any) => {
      onComplete?.();
      toast.success("Created", "The organization has been successfully created.")
      onClose()
      if (isFromMain) {
        router.push(ROUTES.DASHBOARD)
      }
    },
    [onComplete]
  );

  const handleError = useCallback((err: any) => {
  }, []);
  const {
    progress,
    isConnected,
    isConnecting,
    error,
    reconnect
  } = useCreateOrganizationProgress(
    organizationData?.data?.organization.id || null,
    {
      onProgress: handleProgress,
      onComplete: handleComplete,
      onError: handleError,
    }
  );
  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const canClose = isCompleted || isFailed;

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const handleGoHome = () => {
    onGoHome?.();
  };
  useEffect(() => {

    if (isFromMain && isCompleted) {
      console.log("/setting the organization data here in this ");
      dispatch(setOrganization(organizationData))
      router.push('/organizations')
    }

  }, [progress?.status])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            <ProgressTracker
              progress={progress}
              isConnected={isConnected}
              isConnecting={isConnecting}
              error={error}
              onRetry={reconnect}
              title="Creating Organization"
            />
            {/* Error Actions */}
            <AnimatePresence>
              {isFailed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 bg-white rounded-xl border border-red-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-red-700 mb-4">
                    Registration Failed
                  </h3>
                  <p className="text-red-600 text-sm mb-4">
                    There was an issue setting up your organization. Please try again or contact support.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant='primary'
                      onClick={handleGoHome}>
                      Go to Dashboard
                    </Button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* </motion.div> */}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProgressModal;