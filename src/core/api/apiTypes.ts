// ─────────────────────────────────────────────────────────────────────────────
// Generic API response wrappers
//
// These types mirror the standard envelope shape returned by the backend.
// Every RTK Query endpoint should use these instead of raw inline types.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard single-item API response envelope.
 *
 * @example
 *   builder.query<ApiResponse<UserProfile>, void>({ query: () => '/users/me' })
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Pagination metadata returned alongside paginated list responses.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Standard paginated API response envelope.
 * `data` is always an array; `meta` contains page info.
 *
 * @example
 *   builder.query<PaginatedApiResponse<BookingItem>, PaginationQuery>({ ... })
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Common query params for any paginated list endpoint.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * Common request body / path param for any endpoint that targets a single
 * resource by its ID.
 */
export interface IdRequest {
  id: string;
}

/**
 * Convenience type for endpoints that return no meaningful data payload
 * (e.g. logout, delete).
 */
export type NullResponse = ApiResponse<null>;
