import { parseApiError } from '@core/api';

import { ErrorCodes } from './errorCodes';

import type { AppError } from '@shared/types';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Maps an API-level code string to a normalized ErrorCode string. */
function normalizeCode(apiCode: string): string {
  switch (apiCode) {
    case 'UNAUTHORIZED':
      return ErrorCodes.UNAUTHORIZED;
    case 'FORBIDDEN':
      return ErrorCodes.FORBIDDEN;
    case 'NOT_FOUND':
      return ErrorCodes.NOT_FOUND;
    case 'VALIDATION_ERROR':
      return ErrorCodes.VALIDATION_ERROR;
    case 'FETCH_ERROR':
    case 'NETWORK_ERROR':
      return ErrorCodes.NETWORK_ERROR;
    case 'TIMEOUT_ERROR':
      return ErrorCodes.TIMEOUT_ERROR;
    case 'PARSING_ERROR':
      return ErrorCodes.PARSE_ERROR;
    case 'INTERNAL_SERVER_ERROR':
    case 'SERVER_ERROR':
      return ErrorCodes.SERVER_ERROR;
    default:
      return ErrorCodes.UNKNOWN_ERROR;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// mapError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * mapError — normalizes any thrown value into a predictable AppError.
 *
 * Handles:
 *   - ApiError / FetchBaseQueryError / SerializedError (via parseApiError)
 *   - Standard Error objects
 *   - String errors
 *   - Unknown shapes
 *
 * Never throws.
 */
export function mapError(error: unknown): AppError {
  try {
    // String errors
    if (typeof error === 'string') {
      return {
        code: ErrorCodes.UNKNOWN_ERROR,
        message: error,
      };
    }

    // Standard Error objects (but not RTK-style errors that have a `status`)
    if (error instanceof Error && !('status' in error)) {
      return {
        code: ErrorCodes.UNKNOWN_ERROR,
        message: error.message || 'An unexpected error occurred.',
      };
    }

    // RTK Query errors (FetchBaseQueryError / SerializedError) and ApiError
    // parseApiError handles all of these safely
    const parsed = parseApiError(error);
    const code = normalizeCode(parsed.code);

    return {
      code,
      message: parsed.message,
      statusCode: parsed.status !== 0 ? parsed.status : undefined,
    };
  } catch {
    // Safety net: mapError must never throw
    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: 'An unexpected error occurred.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Type-guard helpers
// ─────────────────────────────────────────────────────────────────────────────

export function isAuthError(error: AppError): boolean {
  return (
    error.code === ErrorCodes.UNAUTHORIZED ||
    error.code === ErrorCodes.FORBIDDEN ||
    error.code === ErrorCodes.SESSION_EXPIRED
  );
}

export function isNetworkError(error: AppError): boolean {
  return error.code === ErrorCodes.NETWORK_ERROR || error.code === ErrorCodes.TIMEOUT_ERROR;
}

export function isValidationError(error: AppError): boolean {
  return error.code === ErrorCodes.VALIDATION_ERROR;
}

export function isServerError(error: AppError): boolean {
  return error.code === ErrorCodes.SERVER_ERROR;
}
