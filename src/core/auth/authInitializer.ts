import { initializeAuth } from './authSlice';
import { loadTokens } from './tokenStorage';

import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';

/**
 * initializeAuthState — loads persisted tokens from MMKV and dispatches
 * initializeAuth to seed the Redux store at app startup.
 *
 * Accepts a generic Redux `Dispatch` to avoid a circular dependency between
 * @core/auth and @core/store (store.ts imports authSlice from @core/auth).
 *
 * Call this once at app startup (inside useAuthInitializer).
 */
export function initializeAuthState(dispatch: Dispatch<UnknownAction>): void {
  const { accessToken, refreshToken } = loadTokens();
  dispatch(initializeAuth({ accessToken, refreshToken }));
}
