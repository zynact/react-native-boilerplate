import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  /** True while the initial auth check (reading persisted tokens) is in progress */
  isInitializing: boolean;
  isAuthenticated: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isInitializing: true,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Called after persisted tokens are loaded at startup */
    initializeAuth: (
      state,
      action: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = action.payload.accessToken !== null;
      state.isInitializing = false;
    },

    /** Called on successful login or token refresh */
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    /** Called on logout or auth failure – clears all auth state */
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { initializeAuth, setTokens, clearAuth } = authSlice.actions;
