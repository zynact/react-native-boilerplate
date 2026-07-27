import { HTTP_STATUS } from './apiConstants';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// ─────────────────────────────────────────────────────────────────────────────
// Normalized API error shape
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ApiError — a normalized, predictable error shape returned by parseApiError.
 *
 * Consumers can pattern-match on `status` (HTTP code) or `code` (string enum)
 * to decide how to display or recover from errors.
 */
export interface ApiError {
  /** HTTP status code, or 0 for network/client errors. */
  status: number;
  /** Machine-readable error code. */
  code: string;
  /** Human-readable summary suitable for display. */
  message: string;
  /** Field-level validation errors, e.g. { email: ['is required'] }. */
  errors?: Record<string, string[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Shape that a well-formed API error body may have. */
interface ApiErrorBody {
  code?: unknown;
  message?: unknown;
  errors?: unknown;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null;
}

function extractFieldErrors(errors: unknown): Record<string, string[]> | undefined {
  if (typeof errors !== 'object' || errors === null) {
    return undefined;
  }

  const result: Record<string, string[]> = {};
  let hasEntries = false;

  for (const [key, val] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
      result[key] = val as string[];
      hasEntries = true;
    }
  }

  return hasEntries ? result : undefined;
}

function codeFromStatus(status: number): string {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HTTP_STATUS.FORBIDDEN:
      return 'FORBIDDEN';
    case HTTP_STATUS.NOT_FOUND:
      return 'NOT_FOUND';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return 'VALIDATION_ERROR';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'TOO_MANY_REQUESTS';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'INTERNAL_SERVER_ERROR';
    default:
      return 'API_ERROR';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Type guards for RTK Query error shapes
// ─────────────────────────────────────────────────────────────────────────────

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error !== null && 'message' in error && !('status' in error);
}

// ─────────────────────────────────────────────────────────────────────────────
// parseApiError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseApiError — normalizes any RTK Query error into a predictable ApiError.
 *
 * Handles:
 *   - FetchBaseQueryError with numeric HTTP status
 *   - FetchBaseQueryError with string status: 'FETCH_ERROR' | 'PARSING_ERROR'
 *     | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR'
 *   - SerializedError (Redux middleware/thunk serialization)
 *   - Unknown/unexpected shapes
 */
export function parseApiError(error: unknown): ApiError {
  // ── FetchBaseQueryError ───────────────────────────────────────────────────
  if (isFetchBaseQueryError(error)) {
    // Numeric HTTP status — server responded with an error code
    if (typeof error.status === 'number') {
      const body = isApiErrorBody(error.data) ? error.data : {};
      const code = typeof body.code === 'string' ? body.code : codeFromStatus(error.status);
      const message =
        typeof body.message === 'string' ? body.message : defaultMessageForStatus(error.status);

      return {
        status: error.status,
        code,
        message,
        errors: extractFieldErrors(body.errors),
      };
    }

    // String status — client-side / network error
    switch (error.status) {
      case 'FETCH_ERROR':
        return {
          status: 0,
          code: 'FETCH_ERROR',
          message: 'Network error. Please check your connection and try again.',
        };

      case 'PARSING_ERROR':
        return {
          status: error.originalStatus ?? 0,
          code: 'PARSING_ERROR',
          message: 'The server returned an unexpected response format.',
        };

      case 'TIMEOUT_ERROR':
        return {
          status: 0,
          code: 'TIMEOUT_ERROR',
          message: 'The request timed out. Please try again.',
        };

      case 'CUSTOM_ERROR': {
        const body = isApiErrorBody(error.error) ? error.error : undefined;
        return {
          status: 0,
          code: typeof body?.code === 'string' ? body.code : 'CUSTOM_ERROR',
          message:
            typeof body?.message === 'string' ? body.message : 'An unexpected error occurred.',
        };
      }

      default:
        return {
          status: 0,
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred.',
        };
    }
  }

  // ── SerializedError ───────────────────────────────────────────────────────
  if (isSerializedError(error)) {
    return {
      status: 0,
      code: error.code ?? 'SERIALIZED_ERROR',
      message: error.message ?? 'An unexpected error occurred.',
    };
  }

  // ── Unknown ───────────────────────────────────────────────────────────────
  return {
    status: 0,
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'The request was invalid.';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Your session has expired. Please log in again.';
    case HTTP_STATUS.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    case HTTP_STATUS.NOT_FOUND:
      return 'The requested resource was not found.';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return 'Validation failed. Please check your input.';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'Too many requests. Please slow down and try again.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'A server error occurred. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}
