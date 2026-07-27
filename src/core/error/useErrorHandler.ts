import { useCallback } from 'react';

import { handleError as feedbackHandleError } from './errorFeedback';

import type { AppError } from '@shared/types';

// ─────────────────────────────────────────────────────────────────────────────
// useErrorHandler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useErrorHandler — React hook that exposes the centralized error-handling
 * pipeline for use inside function components.
 *
 * The returned `handleError` is stable across renders (wrapped in useCallback
 * with no dependencies) so it is safe to include in dependency arrays.
 *
 * @example
 *   const { handleError } = useErrorHandler();
 *   try {
 *     await doSomething();
 *   } catch (err) {
 *     handleError(err, 'MyScreen');
 *   }
 */
export function useErrorHandler(): {
  handleError: (error: unknown, context?: string) => AppError;
} {
  const handleError = useCallback(
    (error: unknown, context?: string): AppError => feedbackHandleError(error, context),
    [],
  );

  return { handleError };
}
