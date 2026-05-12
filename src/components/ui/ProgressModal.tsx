"use client";
import React, { useCallback, useEffect, } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressTracker } from './ProgressTracker';
import { useCreateOrganizationProgress } from '@/hooks/useProgressTracking';
import { CreateOrganizationResponse } from '@/apiHooks.ts/organization/organization.types';
import { useAppDispatch } from "@/redux/store";
import { setOrganization } from '@/redux/slices/auth.slice';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/useToast';
import { useScrollLock } from '@/hooks/useScrollLock';
import { ROUTES } from '@/constants';
import logger from '@/utils/logger';
import { useSSE } from '@/hooks/useSSE';

interface ProgressModalProps {
  isOpen: boolean;
  organizationData: CreateOrganizationResponse | null;
  onClose: () => void;
  onComplete?: () => void;
  isFromMain: boolean;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  organizationData,
  onClose,
  onComplete,
  isFromMain
}) => {
  const dispatch = useAppDispatch()
  useScrollLock(isOpen)
  const router = useRouter()
  const handleProgress = useCallback((progress: any) => {
  }, []);

  const handleComplete = useCallback(
    (progress: any) => {
      onComplete?.();
      toast.success("Created", "The organization has been successfully created.");
      if (isFromMain) {
        if (organizationData) {
          dispatch(setOrganization(organizationData));
        }
        router.push(ROUTES.DASHBOARD);
      }
      onClose();
    },
    [onComplete, isFromMain, organizationData, dispatch, router, onClose]
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
      autoReconnect: true,
      maxReconnectAttempts: 10,
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
  useSSE(organizationData?.data?.organization.id);
  useEffect(() => {
    if (isCompleted) {
      logger.log("Organization creation completed successfully");
    }
  }, [isCompleted]);

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
              key={organizationData?.data?.organization.id}
              progress={progress}
              isConnected={isConnected}
              isConnecting={isConnecting}
              error={error}
              onRetry={reconnect}
              title="Creating Organization"
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProgressModal;