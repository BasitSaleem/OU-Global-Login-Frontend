"use client";
import React, { useCallback, useEffect, } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { ProgressTracker } from './ProgressTracker';
import { useCreateOrganizationProgress } from '@/hooks/useProgressTracking';
import { CreateOrganizationResponse } from '@/apiHooks.ts/organization/organization.types';
import { SvgIcon } from './SvgIcon';
import { Button } from './button';
import { useAppDispatch } from "@/redux/store";
import { setOrganization } from '@/redux/slices/auth.slice';
import { useRouter } from 'next/navigation';

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
  const router = useRouter()
  const handleProgress = useCallback((progress: any) => {
    console.log("Progress update:", progress);
  }, []);

  const handleComplete = useCallback(
    (progress: any) => {
      onComplete?.();
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


  const handleViewPortal = () => {
    if (organizationData?.data.leadRegistration?.subDomainName) {
      const domain = 'ownersanalytics.com';
      window.open(`http://${organizationData.data.leadRegistration.subDomainName}.${domain}`, '_blank');
    }
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
          {/* Backdrop */}
          {
            !isFromMain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
              />
            )
          }

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-bg-secondary rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-secondary border-b  px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold ">
                  Organization Registration
                </h2>
                <p className="text-sm  mt-1">
                  {organizationData?.data.organization?.name || 'Setting up your organization...'}
                </p>
              </div>

              {
                !isFromMain && (
                  <div className="flex items-center gap-2">
                    {canClose && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="p-2  hover:text-gray-600 hover:bg-bg-secondary rounded-lg transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                )
              }
            </div>

            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <ProgressTracker
                progress={progress}
                isConnected={isConnected}
                isConnecting={isConnecting}
                error={error}
                onRetry={reconnect}
              />

              {/* Action Buttons */}
              <AnimatePresence>
                {isCompleted && !isFromMain && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 bg-bg-secondary rounded-xl border p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          Registration Complete!
                        </h3>
                        <p className="text-[#9685e2] text-sm">
                          Your organization has been successfully set up and is ready to use.
                        </p>
                      </div>
                    </div>

                    <button onClick={handleViewPortal} className="flex flex-row items-center sm:flex-row gap-3 cursor-pointer hover:scale-110 duration-300">

                      {/* <Image src={Icons.ownerinventory} alt='ownerinventory' width={50} height={50} className="w-20 h-10" /> */}
                      <SvgIcon name='ownersInventory' width={5} height={5} className='text-for w-7 h-7' />
                      <h1 className='mt-1.5'> OwnersInventory</h1>

                    </button>

                    {/* Portal Access Info */}
                    {organizationData?.data.leadRegistration?.subDomainName && (
                      <div className="mt-4 p-4 bg-bg-secondary border rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          OI Access Information
                        </h4>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p>
                            <strong> URL:</strong> {' '}
                            <code className="bg-background px-2 py-1 rounded">
                              http://{organizationData.data.leadRegistration.subDomainName}.{'ownersanalytics.com'}
                            </code>
                          </p>
                          <p>
                            <strong>Note:</strong> Login credentials have been sent to your email address.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <Button
                        variant='primary'
                        onClick={handleGoHome}>
                        Go to Dashboard
                      </Button>
                      {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoHome}
                        className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2  rounded-lg hover:bg-primary transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Go to Dashboard
                      </motion.button> */}
                    </div>
                  </motion.div>

                )}
              </AnimatePresence>

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
                      {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoHome}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        <Home className="w-4 h-4" />
                      </motion.button> */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProgressModal;