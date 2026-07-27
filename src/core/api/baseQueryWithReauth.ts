import {
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { appConfig } from '@core/config';

import { clearAuth, setTokens } from '../auth/authSlice';
import { clearTokens, saveTokens } from '../auth/tokenStorage';

import type { RootState } from '../store/store';
import type { RefreshTokenResponse } from '@features/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Auth endpoint paths — these are never retried on 401
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_PATHS = ['/auth/login', '/auth/refresh', '/auth/logout'] as const;

function isAuthEndpoint(url: string | undefined): boolean {
  if (url === undefined) {
    return false;
  }
  return AUTH_PATHS.some((path) => url.includes(path));
}

// ─────────────────────────────────────────────────────────────────────────────
// Refresh queue — single-flight mutex without external libraries
// ─────────────────────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void): void {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function onRefreshFailed(): void {
  refreshSubscribers = [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner fetchBaseQuery instances
// ─────────────────────────────────────────────────────────────────────────────

/**
 * rawBaseQuery — attaches the current Bearer token from Redux state.
 * Uses api.getState() provided by RTK Query to avoid a circular store import.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: appConfig.API_BASE_URL,
  timeout: appConfig.API_TIMEOUT,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token !== null) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * refreshBaseQuery — no auth headers; used exclusively for /auth/refresh
 * to avoid sending the expired access token.
 */
const refreshBaseQuery = fetchBaseQuery({
  baseUrl: appConfig.API_BASE_URL,
  timeout: appConfig.API_TIMEOUT,
});

// ─────────────────────────────────────────────────────────────────────────────
// baseQueryWithReauth
// ─────────────────────────────────────────────────────────────────────────────

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  // Determine the URL for auth-endpoint check
  const url = typeof args === 'string' ? args : args.url;

  // Never retry auth endpoints to prevent infinite loops
  if (isAuthEndpoint(url)) {
    return result;
  }

  // ── Single-flight refresh ─────────────────────────────────────────────────

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const state = api.getState() as RootState;
      const currentRefreshToken = state.auth.refreshToken;

      if (currentRefreshToken === null) {
        // No refresh token stored — force logout immediately
        api.dispatch(clearAuth());
        clearTokens();
        onRefreshFailed();
        return result;
      }

      const refreshResult = await refreshBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken: currentRefreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data !== undefined) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data as RefreshTokenResponse;

        // Persist new tokens and update Redux via api.dispatch (no store import)
        saveTokens({ accessToken, refreshToken: newRefreshToken });
        (api as BaseQueryApi).dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

        // Unblock the queue
        onTokenRefreshed(accessToken);

        // Retry the original request — store now holds the fresh token
        return rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh endpoint returned an error — force logout
        api.dispatch(clearAuth());
        clearTokens();
        onRefreshFailed();
        return result;
      }
    } catch {
      api.dispatch(clearAuth());
      clearTokens();
      onRefreshFailed();
      return result;
    } finally {
      isRefreshing = false;
    }
  }

  // ── Queue: wait for the in-flight refresh to complete ─────────────────────

  return new Promise<ReturnType<typeof rawBaseQuery>>((resolve) => {
    subscribeTokenRefresh((_newToken: string) => {
      // rawBaseQuery reads the fresh token from Redux via prepareHeaders/getState
      resolve(rawBaseQuery(args, api, extraOptions));
    });
  });
};
