import { logger, ToastService } from '@core/services';

import { ErrorCodes } from './errorCodes';
import { isAuthError, mapError } from './errorMapper';

import type { AppError } from '@shared/types';

// ─────────────────────────────────────────────────────────────────────────────
// User-facing messages (no internal codes exposed)
// ─────────────────────────────────────────────────────────────────────────────

function getUserMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCodes.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again.';
    case ErrorCodes.TIMEOUT_ERROR:
      return 'The request timed out. Please try again.';
    case ErrorCodes.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorCodes.VALIDATION_ERROR:
      return 'Validation failed. Please check your input.';
    case ErrorCodes.SERVER_ERROR:
      return 'A server error occurred. Please try again later.';
    case ErrorCodes.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    case ErrorCodes.PARSE_ERROR:
      return 'The server returned an unexpected response. Please try again.';
    case ErrorCodes.UNAUTHORIZED:
    case ErrorCodes.SESSION_EXPIRED:
      return 'Your session has expired. Please log in again.';
    default:
      // Fall back to the mapped message if it exists, otherwise generic
      return error.message || 'An unexpected error occurred.';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// handleError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * handleError — central error processing pipeline.
 *
 * 1. Maps the raw error into an AppError.
 * 2. Logs the error with optional context label.
 * 3. Shows a toast for non-auth errors (auth errors are handled by the
 *    token-refresh flow so we don't double-notify the user).
 *
 * Returns the normalized AppError so callers can inspect it if needed.
 */
export function handleError(error: unknown, context?: string): AppError {
  const mapped = mapError(error);

  logger.error(`[${context ?? 'App'}] ${mapped.message}`, error);

  if (!isAuthError(mapped)) {
    ToastService.error(getUserMessage(mapped));
  }

  return mapped;
}
