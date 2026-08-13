"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { JobProgress } from '@/types/progressTypes';
import { cn } from '@/utils/cn';
import { SvgIcon, IconName } from './SvgIcon';
import { Dots } from './Dots';
import logger from '@/utils/logger';

interface ProgressTrackerProps {
  progress: JobProgress | null;
  isConnected?: boolean;
  isConnecting?: boolean;
  error?: string | null;
  className?: string;
  onRetry?: () => void;
  iconName?: IconName;
  title?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  className,
  iconName = 'ownersUniverseColl',
  title = 'Processing...',
}) => {
  const percentage = progress?.progress || 0;
  const status = progress?.status || 'queued';

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    switch (status) {
      case 'completed':
        return '#795CF5';
      case 'failed':
        return '#ef4444';
      case 'in-progress':
        return '#985cff';
      case 'queued':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  };
  logger.log("Progress --------------------: ", progress)
  return (
    <div className={cn("w-full flex flex-col items-center justify-center py-8", className)}>

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#985cff"
            strokeWidth="6"
            className="text-bg-secondary opacity-30"
          />
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: strokeDashoffset
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          />
        </svg>

        <div className="absolute flex items-center justify-center">
          <SvgIcon name={iconName} width={70} height={70} className="text-foreground" />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
          <span
            className="text-sm font-medium"
            style={{ color: getStrokeColor() }}
          >
            {percentage}%
          </span>
        </div>
        <h2 className="text-primary font-semibold mt-60 text-nowrap">
          {title}
          <Dots dotSize="3px" className="gap-1 mt-1" />

        </h2>
      </div>


    </div>
  );
};

export default ProgressTracker;