import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { JobProgress, SSEEvent } from "@/types/progressTypes";
import logger from "@/utils/logger";

export interface UseProgressTrackingOptions {
  onProgress?: (progress: JobProgress) => void;
  onComplete?: (progress: JobProgress) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  operationType?: "registration" | "deletion";
}

export const useProgressTracking = (
  url: string | null,
  options: UseProgressTrackingOptions = {},
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
    maxReconnectAttempts = 5,
    operationType,
  } = options;

  const callbacksRef = useRef({ onProgress, onComplete, onError, onConnect });

  useEffect(() => {
    callbacksRef.current = { onProgress, onComplete, onError, onConnect };
  }, [onProgress, onComplete, onError, onConnect]);

  const cleanup = useCallback(() => {
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
      logger.log("SSE connection already exists or invalid URL");
      return;
    }
    setProgress(null);
    setIsConnecting(true);
    setError(null);

    try {
      const eventSource = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        logger.log("SSE connection opened");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        callbacksRef.current.onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          switch (data.type) {
            case "progress":
              if (data.data) {
                setProgress(data.data);
                callbacksRef.current.onProgress?.(data.data);
                if (data.data.status === "completed") {
                  callbacksRef.current.onComplete?.(data.data);
                } else if (data.data.status === "failed") {
                  callbacksRef.current.onError?.(data.data.errorMessage || "Job failed");
                }
              }
              break;
            case "heartbeat":
              break;
            case "error":
              logger.error("SSE error event:", data.message);
              setError(data.message || "Unknown error");
              callbacksRef.current.onError?.(data.message || "Unknown error");
              break;
            default:
              logger.log("Unknown SSE event type:", data.type);
          }
        } catch (parseError) {
          logger.error("Failed to parse SSE message:", parseError, event.data);
        }
      };

      eventSource.onerror = (event) => {
        logger.error("SSE connection error:", event);
        setIsConnected(false);
        setIsConnecting(false);
        const errorMessage = "Connection error occurred";
        setError(errorMessage);
        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current - 1),
            30000,
          );

          logger.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            cleanup();
            connect();
          }, delay);
        } else {
          callbacksRef.current.onError?.(errorMessage);
        }
      };
    } catch (error) {
      logger.error("Failed to create SSE connection:", error);
      setIsConnecting(false);
      setError("Failed to establish connection");
      callbacksRef.current.onError?.("Failed to establish connection");
    }
  }, [
    url,
    autoReconnect,
    maxReconnectAttempts,
    cleanup,
  ]);

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
      setProgress(null);
      setError(null);
      cleanup();
      connect();
    }

    return cleanup;
  }, [url, connect, cleanup]);

  return {
    progress,
    isConnected,
    isConnecting,
    error,
    reconnect,
    disconnect,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
};

// Hook delete organization progress
export const useDeleteOrganizationProgress = (
  organizationId: string | null,
  options: UseProgressTrackingOptions = {},
) => {
  const baseUrl = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_PROD_BASE_URL,
    [],
  );

  const url = organizationId
    ? `${baseUrl}/og/progress/organization/${organizationId}/stream?type=deletion`
    : null;

  return useProgressTracking(url, {
    ...options,
    operationType: "deletion",
  });
};

// Hook specifically for organization progress tracking
export const useCreateOrganizationProgress = (
  organizationId: string | null,
  options: UseProgressTrackingOptions = {},
) => {
  const baseUrl = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_PROD_BASE_URL,
    [],
  );

  const url = organizationId
    ? `${baseUrl}/og/progress/organization/${organizationId}/stream?type=registration`
    : null;

  return useProgressTracking(url, {
    ...options,
    operationType: "registration",
  });
};