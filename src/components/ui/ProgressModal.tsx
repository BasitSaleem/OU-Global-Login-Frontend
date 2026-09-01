"use client";
import React, { useCallback, useEffect, } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient()
  useScrollLock(isOpen)
  const router = useRouter()
  const handleProgress = useCallback((progress: any) => {
  }, []);

  const handleComplete = useCallback(
    (progress: any) => {
      // The org list's status badge only ever fetched once, right after the
      // org was created (before GHL provisioning even started) — nothing
      // told it to check again once provisioning actually finished, so it
      // was stuck on "Processing..." until a manual refresh. Re-invalidate
      // it here so it reflects the real, final state on its own.
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
    [queryClient, onComplete, isFromMain, organizationData, dispatch, router, onClose]
  );

  const handleError = useCallback((err: any) => {
    // Same reasoning as handleComplete — a failed provisioning attempt is
    // also a terminal state the list should reflect (e.g. "Provisioning
    // failed") instead of sitting on a stale "Processing..." badge.
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
  }, [queryClient]);
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