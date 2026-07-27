import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQueryWithReauth';

/**
 * baseApi — single RTK Query API instance for the entire app.
 *
 * Architecture:
 *   baseApi                   ← defined here
 *     └── injectEndpoints()   ← each feature/auth.api.ts calls this
 *
 * Rules:
 *   - One base API only. Never create a second createApi().
 *   - Features inject their endpoints via baseApi.injectEndpoints()
 *   - All cache tags are registered in tagTypes below
 *   - Auth header is injected via prepareHeaders inside baseQueryWithReauth
 *   - Automatic 401 → token refresh is handled inside baseQueryWithReauth
 */
export const baseApi = createApi({
  reducerPath: 'api',

  baseQuery: baseQueryWithReauth,

  /**
   * Register all cache tags here.
   * Features add their tags when injecting endpoints.
   */
  tagTypes: ['Auth', 'User', 'List', 'Detail'],

  endpoints: () => ({}),
});
