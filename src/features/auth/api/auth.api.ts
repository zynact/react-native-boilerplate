import { baseApi } from '@core/api';

// ─────────────────────────────────────────────────────────────────────────────
// Request / Response types
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Injected endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Auth API – injected into the single baseApi.
 *
 * Pattern:
 *   baseApi.injectEndpoints({ endpoints: (builder) => ({ ... }) })
 *
 * The auth endpoints are excluded from the automatic Bearer token header
 * because they either don't need it (login) or provide their own token
 * (refresh). This is handled in the refresh middleware in Phase 5.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  // Prevent overriding endpoints if this module is hot-reloaded
  overrideExisting: false,
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;
