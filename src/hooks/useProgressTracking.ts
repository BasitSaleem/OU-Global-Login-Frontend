import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { JobProgress, SSEEvent } from "@/types/progressTypes";
import { request } from "@/utils/requestFunction";
import logger from "@/utils/logger";

// If no progress event arrives within this window while a job is still
// in-progress, treat the SSE stream as silently stalled — a connection can be
// black-holed by a proxy/load balancer without the browser's EventSource ever
// firing `onerror`, so relying on `onerror` alone leaves the UI frozen forever.
const DEFAULT_STALE_TIMEOUT_MS = 45000;
const STALE_CHECK_INTERVAL_MS = 5000;

export interface UseProgressTrackingOptions {
  onProgress?: (progress: JobProgress) => void;
  onComplete?: (progress: JobProgress) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  operationType?: "registration" | "deletion" | "op_registration";
  /**
   * Stall-recovery safety net. When the stream has gone quiet for
   * `staleTimeoutMs`, the hook calls this to fetch the current status via a
   * plain REST request; whatever it returns is applied exactly like an
   * incoming SSE progress message, and the stream is then forced to
   * reconnect regardless of whether the fetch succeeded.
   */
  fetchFallback?: () => Promise<JobProgress | JobProgress[] | null>;
  /** Default 45000ms. Pass `false` to disable stall detection entirely. */
  staleTimeoutMs?: number | false;
  /**
   * Overrides how the stall watchdog decides whether it should stop
   * monitoring. Defaults to reading the last-seen raw progress message's own
   * status — which is WRONG for a caller (like
   * useCreateOrganizationProgress) that combines multiple parallel jobs into
   * one aggregate: the last raw message processed could be the *faster* job
   * reporting "completed" while a slower parallel job is still running, which
   * would stop the watchdog prematurely. Such callers must pass their own
   * aggregate-aware check here.
   */
  isFinished?: () => boolean;
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
  const progressRef = useRef<JobProgress | null>(null);
  const lastProgressAtRef = useRef(Date.now());

  const {
    onProgress,
    onComplete,
    onError,
    onConnect,
    autoReconnect = false,
    maxReconnectAttempts = 5,
    operationType,
    fetchFallback,
    staleTimeoutMs,
    isFinished,
  } = options;

  const callbacksRef = useRef({ onProgress, onComplete, onError, onConnect });
  const fetchFallbackRef = useRef(fetchFallback);
  const isFinishedRef = useRef(isFinished);

  useEffect(() => {
    callbacksRef.current = { onProgress, onComplete, onError, onConnect };
  }, [onProgress, onComplete, onError, onConnect]);

  useEffect(() => {
    fetchFallbackRef.current = fetchFallback;
  }, [fetchFallback]);

  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  // Shared by both the live EventSource message handler and the stall
  // fallback poll below, so a recovered REST fetch behaves identically to a
  // normal SSE message (same operationType filtering, same callbacks).
  const applyProgress = useCallback(
    (data: JobProgress) => {
      if (
        operationType &&
        data.operationType &&
        data.operationType !== operationType
      ) {
        return;
      }

      lastProgressAtRef.current = Date.now();
      progressRef.current = data;
      setProgress(data);
      callbacksRef.current.onProgress?.(data);
      if (data.status === "completed") {
        callbacksRef.current.onComplete?.(data);
      } else if (data.status === "failed") {
        callbacksRef.current.onError?.(data.errorMessage || "Job failed");
      }
    },
    [operationType],
  );

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
        lastProgressAtRef.current = Date.now();
        callbacksRef.current.onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          switch (data.type) {
            case "progress":
              if (data.data) {
                applyProgress(data.data);
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
  }, [url, autoReconnect, maxReconnectAttempts, cleanup, applyProgress]);

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
      progressRef.current = null;
      lastProgressAtRef.current = Date.now();
      cleanup();
      connect();
    }

    return cleanup;
  }, [url, connect, cleanup]);

  // Stall watchdog: fires independently of `onerror`, since a black-holed
  // connection may never transition to an error state on its own.
  useEffect(() => {
    if (!url || staleTimeoutMs === false) return;

    const timeout = staleTimeoutMs ?? DEFAULT_STALE_TIMEOUT_MS;

    const interval = setInterval(async () => {
      const finished = isFinishedRef.current
        ? isFinishedRef.current()
        : progressRef.current?.status === "completed" ||
          progressRef.current?.status === "failed";
      if (finished) return;

      const elapsed = Date.now() - lastProgressAtRef.current;
      if (elapsed < timeout) return;

      logger.log(
        `No progress update in ${elapsed}ms — SSE stream looks stalled, attempting recovery`,
      );
      // Reset immediately so a slow fallback fetch/reconnect can't cause this
      // to keep re-firing every tick while recovery is already in flight.
      lastProgressAtRef.current = Date.now();

      if (fetchFallbackRef.current) {
        try {
          const result = await fetchFallbackRef.current();
          if (Array.isArray(result)) {
            result.forEach((p) => p && applyProgress(p));
          } else if (result) {
            applyProgress(result);
          }
        } catch (fallbackError) {
          logger.error("Stall-recovery fallback fetch failed:", fallbackError);
        }
      }

      // The existing EventSource may be dead without ever firing `onerror` —
      // force a fresh connection regardless of whether the fetch above helped.
      reconnect();
    }, STALE_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [url, staleTimeoutMs, applyProgress, reconnect]);

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

  const pollLatestProgress = useCallback(async (): Promise<JobProgress | null> => {
    if (!organizationId) return null;
    try {
      const res = await request<{ success: boolean; data: JobProgress }>(
        `/og/progress/delete-organization/${organizationId}`,
        "GET",
      );
      return res.data;
    } catch (err) {
      logger.error("Fallback progress poll failed:", err);
      return null;
    }
  }, [organizationId]);

  return useProgressTracking(url, {
    ...options,
    operationType: "deletion",
    fetchFallback: pollLatestProgress,
  });
};

// Hook specifically for organization progress tracking. Org creation can run
// OI's job ("registration", 13 steps) and OP's job ("op_registration", 5
// steps) in PARALLEL when both products are selected — they are independent
// BullMQ jobs, not one combined job. This hook tracks both streams and
// combines them into a single weighted percentage: (sum of current steps) /
// (sum of total steps) across whichever job type(s) have reported progress so
// far. For a single-product creation this reduces to exactly that job's own
// percentage (only one type ever reports), so there's no behavior change for
// the OI-only/OP-only cases.
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

  // No `type` query param here: org creation may run under "registration"
  // (OI) or "op_registration" (OP) or both, and the backend already treats an
  // omitted type as "return the latest across all types" — see
  // getProgressByOrganizationId.
  const url = organizationId
    ? `${baseUrl}/og/progress/organization/${organizationId}/stream`
    : null;

  const { onProgress, onComplete, onError, ...restOptions } = options;

  const progressByTypeRef = useRef<
    Partial<Record<"registration" | "op_registration", JobProgress>>
  >({});
  const [combinedProgress, setCombinedProgress] = useState<JobProgress | null>(
    null,
  );
  // Mirrors `combinedProgress` for the stall watchdog below, which runs
  // inside a setInterval and needs the current aggregate status rather than
  // a snapshot captured at effect-setup time.
  const combinedProgressRef = useRef<JobProgress | null>(null);
  const completedFiredRef = useRef(false);
  const failedFiredRef = useRef(false);

  useEffect(() => {
    progressByTypeRef.current = {};
    setCombinedProgress(null);
    combinedProgressRef.current = null;
    completedFiredRef.current = false;
    failedFiredRef.current = false;
  }, [organizationId]);

  const handleRawProgress = useCallback(
    (data: JobProgress) => {
      const type = data.operationType;
      if (type === "registration" || type === "op_registration") {
        progressByTypeRef.current = {
          ...progressByTypeRef.current,
          [type]: data,
        };
      }
      const entries = Object.entries(progressByTypeRef.current) as Array<
        ["registration" | "op_registration", JobProgress]
      >;
      if (entries.length === 0) return;

      // The live SSE payload only ever includes {status, progress,
      // operationType, currentStep, message, errorMessage} — it does NOT
      // include currentStepNumber/totalSteps (see progressTracking.service.ts
      // saveProgress's filteredProgress). So the weighted total has to be
      // reconstructed from each job's own already-computed 0-100 `progress`
      // and these fixed, known step counts (LEAD_REGISTRATION_STEPS.length /
      // OP_REGISTRATION_STEPS.length on the backend).
      const totalStepsByType: Record<"registration" | "op_registration", number> = {
        registration: 13,
        op_registration: 5,
      };

      let totalSteps = 0;
      let currentStepNumber = 0;
      for (const [jobType, p] of entries) {
        const steps = totalStepsByType[jobType];
        totalSteps += steps;
        currentStepNumber +=
          p.status === "completed"
            ? steps
            : Math.round(((p.progress || 0) / 100) * steps);
      }

      const values = entries.map(([, p]) => p);
      const failedEntry = values.find((p) => p.status === "failed");
      const activeEntry = values.find(
        (p) => p.status !== "completed" && p.status !== "failed",
      );
      const active = failedEntry ?? activeEntry ?? values[values.length - 1];
      const allCompleted = values.every((p) => p.status === "completed");

      const merged: JobProgress = {
        ...active,
        totalSteps,
        currentStepNumber,
        progress: totalSteps > 0 ? Math.round((currentStepNumber / totalSteps) * 100) : 0,
        status: failedEntry ? "failed" : allCompleted ? "completed" : "in-progress",
      };

      setCombinedProgress(merged);
      combinedProgressRef.current = merged;
      onProgress?.(merged);

      if (merged.status === "completed" && !completedFiredRef.current) {
        completedFiredRef.current = true;
        onComplete?.(merged);
      } else if (merged.status === "failed" && !failedFiredRef.current) {
        failedFiredRef.current = true;
        onError?.(merged.errorMessage || "Job failed");
      }
    },
    [onProgress, onComplete, onError],
  );

  const pollLatestProgress = useCallback(async (): Promise<
    JobProgress[] | null
  > => {
    if (!organizationId) return null;
    try {
      const res = await request<{
        success: boolean;
        data: {
          registration: JobProgress | null;
          op_registration: JobProgress | null;
        };
      }>(`/og/progress/create-organization/${organizationId}`, "GET");
      const results: JobProgress[] = [];
      if (res.data.registration) results.push(res.data.registration);
      if (res.data.op_registration) results.push(res.data.op_registration);
      return results.length > 0 ? results : null;
    } catch (err) {
      logger.error("Fallback progress poll failed:", err);
      return null;
    }
  }, [organizationId]);

  const isFinished = useCallback(
    () =>
      combinedProgressRef.current?.status === "completed" ||
      combinedProgressRef.current?.status === "failed",
    [],
  );

  const base = useProgressTracking(url, {
    ...restOptions,
    onProgress: handleRawProgress,
    fetchFallback: pollLatestProgress,
    // The base hook's default stall-check reads the last-seen RAW message's
    // own status, which is wrong here: when both OI and OP are running, the
    // last raw message could be the faster job (OP) reporting "completed"
    // while OI is still mid-flight. Use the actual combined/aggregate status
    // instead, so the watchdog keeps monitoring until BOTH jobs finish.
    isFinished,
    // Deliberately NOT forwarding onComplete/onError to the base hook — it
    // fires them per-message, as soon as ANY single job reports
    // completed/failed. When both OI and OP are running, that means the
    // faster one (usually OP) would close/redirect the modal while the
    // other is still provisioning. handleRawProgress fires them itself,
    // exactly once, only once ALL contributing jobs have finished.
  });

  return { ...base, progress: combinedProgress ?? base.progress };
};
