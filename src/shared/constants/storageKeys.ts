/**
 * Centralized storage key constants.
 * All MMKV keys must be defined here – no magic strings in feature code.
 */
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',

  // User
  USER_PROFILE: 'user.profile',

  // App
  ONBOARDING_COMPLETE: 'app.onboardingComplete',
  SELECTED_THEME: 'app.selectedTheme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
