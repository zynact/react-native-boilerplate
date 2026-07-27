/**
 * API_ENDPOINTS — placeholder for app-level endpoint constants.
 * Feature APIs define their own endpoint paths locally (e.g. '/auth/login').
 * Add shared cross-feature paths here if needed.
 */
export const API_ENDPOINTS = {} as const;

/**
 * HTTP_STATUS — typed HTTP status code constants.
 * Use these instead of magic numbers throughout the codebase.
 *
 * @example
 *   if (error.status === HTTP_STATUS.UNAUTHORIZED) { ... }
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
