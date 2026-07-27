import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { appConfig } from '@core/config';

import type { RootState } from '../store/store';

// ─────────────────────────────────────────────────────────────────────────────
// uploadBaseQuery
// ─────────────────────────────────────────────────────────────────────────────

/**
 * uploadBaseQuery — a fetchBaseQuery variant for multipart/form-data uploads.
 *
 * Behaviour:
 *   - Injects the Bearer token from Redux state (same as rawBaseQuery in
 *     baseQueryWithReauth).
 *   - Does NOT set Content-Type manually; the browser/native runtime must
 *     derive it from the FormData body so that the multipart boundary is
 *     included automatically.
 *   - Does NOT attempt a token refresh on 401. Upload endpoints sit behind
 *     authenticated routes — if the token is expired, the caller should
 *     surface the error and let the auth flow handle re-authentication.
 *
 * Usage:
 *   Create a separate injected API slice (or injectEndpoints) that uses
 *   uploadBaseQuery as its baseQuery for file-upload endpoints.
 *
 * @example
 *   export const uploadApi = createApi({
 *     reducerPath: 'uploadApi',
 *     baseQuery: uploadBaseQuery,
 *     endpoints: () => ({}),
 *   });
 */
const _uploadFetchBaseQuery = fetchBaseQuery({
  baseUrl: appConfig.API_BASE_URL,
  timeout: appConfig.API_TIMEOUT,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token !== null) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type here — FormData sets it automatically with the
    // correct multipart boundary. Setting it manually would break the upload.
    return headers;
  },
});

export const uploadBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  return _uploadFetchBaseQuery(args, api, extraOptions);
};
