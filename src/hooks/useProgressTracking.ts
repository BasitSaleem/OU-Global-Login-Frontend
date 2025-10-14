import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { JobProgress, SSEEvent } from '@/types/progressTypes';

export interface UseProgressTrackingOptions {
  onProgress?: (progress: JobProgress) => void;
  onComplete?: (progress: JobProgress) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
}

export const useProgressTracking = (
  url: string | null,
  options: UseProgressTrackingOptions = {}
) => {
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    onProgress,
    onComplete,
    onError,
    onConnect,
    autoReconnect = false,
    maxReconnectAttempts = 5
  } = options;

  const cleanup = useCallback(() => {// cleanup function is memoized because of the useCallback() so the function reference cannot be changed on every rerender rather it will be on change of change of dependency array change 
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(() => {
    if (!url || eventSourceRef.current) {
      console.log("⚠️ SSE connection already exists or invalid URL");
      return;
    }
    setIsConnecting(true);
    setError(null);

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);

          switch (data.type) {
            case 'connected':
              console.log('SSE connected:', data.message);
              break;

            case 'progress':
              if (data.data) {
                setProgress(data.data);
                onProgress?.(data.data);

                if (data.data.status === 'completed') {
                  onComplete?.(data.data);
                } else if (data.data.status === 'failed') {
                  onError?.(data.data.errorMessage || 'Job failed');
                }
              }
              break;

            case 'heartbeat':
              break;

            case 'error':
              console.error('SSE error event:', data.message);
              setError(data.message || 'Unknown error');
              onError?.(data.message || 'Unknown error');
              break;

            default:
              console.log('Unknown SSE event type:', data.type);
          }
        } catch (parseError) {
          console.error('Failed to parse SSE message:', parseError, event.data);
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        setIsConnected(false);
        setIsConnecting(false);

        const errorMessage = 'Connection error occurred';
        setError(errorMessage);
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);

          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            cleanup();
            connect();
          }, delay);
        } else {
          onError?.(errorMessage);
        }
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      setIsConnecting(false);
      setError('Failed to establish connection');
      onError?.('Failed to establish connection');
    }
  }, [url, onProgress, onComplete, onError, onConnect, autoReconnect, maxReconnectAttempts, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const reconnect = useCallback(() => {
    cleanup();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [cleanup, connect]);

  useEffect(() => {
    if (url) {
      connect();
    }

    return cleanup;
  }, [url, connect, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    progress,
    isConnected,
    isConnecting,
    error,
    reconnect,
    disconnect,
    reconnectAttempts: reconnectAttemptsRef.current
  };
};

// Hook specifically for job progress tracking
export const useJobProgress = (
  jobId: string | null,
  options: UseProgressTrackingOptions = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = jobId ? `${baseUrl}/progress/job/${jobId}/stream` : null;
  console.log(url);

  return useProgressTracking(url, options);
};

// Hook specifically for organization progress tracking  
export const useOrganizationProgress = (
  organizationId: string | null,
  options: UseProgressTrackingOptions = {}
) => {
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL, []);
  const url = organizationId ? `${baseUrl}/progress/organization/${organizationId}/stream` : null;

  return useProgressTracking(url, options);
};