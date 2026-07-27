// ─────────────────────────────────────────────────────────────────────────────
// Typed error code registry
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorCodes = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  // Client
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
