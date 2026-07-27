import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@core/store';

import { initializeAuthState } from './authInitializer';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseAuthInitializerResult {
  isInitializing: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useAuthInitializer — runs once on mount to load persisted tokens from
 * storage and seed the Redux auth slice.
 *
 * Returns `isInitializing: true` until the token load completes, preventing
 * the navigator from rendering before auth state is known.
 *
 * NOTE: This hook must NOT be re-exported from @core/auth/index.ts because
 * it depends on @core/store, which in turn imports authSlice from @core/auth —
 * creating a circular dependency. Import it directly:
 *   import { useAuthInitializer } from '@core/auth/useAuthInitializer';
 */
export function useAuthInitializer(): UseAuthInitializerResult {
  const dispatch = useAppDispatch();
  const isInitializing = useAppSelector((state) => state.auth.isInitializing);

  useEffect(() => {
    initializeAuthState(dispatch);
    // dispatch is stable — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isInitializing };
}
