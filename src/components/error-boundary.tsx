'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui';
import { RefreshCw, Home } from 'lucide-react';
import { SvgIcon } from '@/components/ui/SvgIcon';

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
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br bg-card">
          {/* Header with logo */}
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <SvgIcon
                name="ownersUniverse"
                className="text-foreground"
                width={140}
                height={40}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex items-center justify-center px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
            <div className="max-w-lg w-full">
              <div className="bg-white dark:bg-bg-secondary rounded-2xl shadow-lg p-6 sm:p-8">
                {/* Error Icon */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-bg-secondary rounded-full mb-4">
                    <svg
                      className="w-10 h-10 text-primary-500 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-heading-1 sm:text-2xl font-bold text-foreground mb-2">
                    Oops! Something Went Wrong
                  </h1>
                  <p className="text-body-medium text-text">
                    We encountered an unexpected error. Don't worry, we're on it!
                  </p>
                </div>

                {/* Error Details for Development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
                    <h3 className="text-body-small-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Error Details (Development Mode)
                    </h3>
                    <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg p-3 mb-3">
                      <p className="text-body-tiny font-mono text-red-900 dark:text-red-200 break-words">
                        {this.state.error.message}
                      </p>
                    </div>
                    {this.state.errorInfo && (
                      <details className="group">
                        <summary className="text-body-tiny text-red-700 dark:text-red-400 cursor-pointer hover:text-red-900 dark:hover:text-red-300 flex items-center gap-1 font-medium">
                          <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          View Stack Trace
                        </summary>
                        <pre className="text-body-tiny font-mono text-red-800 dark:text-red-300 mt-3 overflow-auto max-h-48 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-lg leading-relaxed">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={this.handleReset}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                    className="w-full h-11 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white text-body-medium-bold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    Try Again
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    leftIcon={<Home className="h-4 w-4" />}
                    variant="primary"
                    className='w-full rounded-full h-11'
                  >
                    Go Home
                  </Button>
                </div>

                {/* Help Text */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-body-tiny text-text">
                    If this problem persists, please{' '}
                    <a href="/login" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
                      contact our support team
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-body-tiny text-text">
                  © 2025 Owners Universe - All rights reserved
                </p>
              </div>
            </div>
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

// Simple error fallback components with improved design
export function SimpleErrorFallback({ error, reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="p-6 text-center bg-white dark:bg-bg-secondary rounded-xl border border-border">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mb-3">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-heading-2 font-semibold text-foreground mb-2">
        Something went wrong
      </h3>
      <p className="text-body-medium text-text mb-4 break-words max-w-md mx-auto">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {reset && (
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-body-small-bold rounded-full transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function NetworkErrorFallback({ retry }: { retry?: () => void }) {
  return (
    <div className="p-6 text-center bg-white dark:bg-bg-secondary rounded-xl border border-border">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-3">
        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-heading-2 font-semibold text-foreground mb-2">
        Network Error
      </h3>
      <p className="text-body-medium text-text mb-4">
        Please check your internet connection and try again.
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-body-small-bold rounded-full transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
