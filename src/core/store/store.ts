import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@core/api';
import { authSlice } from '@core/auth';

/**
 * Redux Store
 *
 * Slice registration:
 *   - auth        – authentication state (tokens, isAuthenticated)
 *   - api         – RTK Query cache (all injected endpoints share this)
 *
 * To add a feature slice:
 *   1. Create src/features/<name>/<name>Slice.ts
 *   2. Import and add to the reducer map below
 */
export const store = configureStore({
  reducer: {
    // Core slices
    [authSlice.name]: authSlice.reducer,

    // RTK Query – single API cache for the entire app
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

// ─────────────────────────────────────────────────────────────────────────────
// Inferred types – use these everywhere, never import the store directly
// ─────────────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
