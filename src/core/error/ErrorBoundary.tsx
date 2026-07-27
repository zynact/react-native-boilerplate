import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { logger } from '@core/services';
import { ErrorState } from '@shared/components';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Defaults to ErrorState with a retry button. */
  fallback?: ReactNode;
  /** Optional callback invoked after the error is logged. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// ErrorBoundary
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ErrorBoundary — class component that catches React render/lifecycle errors.
 *
 * - Logs caught errors via the logger service.
 * - Renders a customizable fallback UI when an error is caught.
 * - Default fallback uses the shared ErrorState component with a retry button
 *   that resets the boundary back to healthy state.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error(`[ErrorBoundary] ${error.message}`, {
      error,
      componentStack: info.componentStack,
    });

    this.props.onError?.(error, info);
  }

  reset(): void {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title='Something went wrong'
          description={
            this.state.error?.message ?? 'An unexpected error occurred. Please try again.'
          }
          onRetry={this.reset}
          retryLabel='Try again'
        />
      );
    }

    return this.props.children;
  }
}
