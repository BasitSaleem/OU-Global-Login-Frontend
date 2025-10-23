'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
       window.location.reload()
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Error Details (Development Only)
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                variant="primary"
                className="flex-1"
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Try Again
              </Button>
            
              <Button
                onClick={this.handleGoHome}
                variant="ghost"
                className="flex-1"
                leftIcon={<Home className="h-4 w-4" />}
              >
                Go Home
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by hook:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  };
}

// Higher-order component for error handling
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Simple error fallback components
export function SimpleErrorFallback({ error, reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {reset && (
        <Button onClick={reset} size="sm" variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}

export function NetworkErrorFallback({ retry }: { retry?: () => void }) {
  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Network Error
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Please check your internet connection and try again.
      </p>
      {retry && (
        <Button onClick={retry} size="sm" variant="primary">
          Retry
        </Button>
      )}
    </div>
  );
}
