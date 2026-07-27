import { StorageService } from '@core/storage';
import { STORAGE_KEYS } from '@shared/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoadedTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token persistence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist both tokens to MMKV storage.
 */
export function saveTokens(tokens: TokenPair): void {
  StorageService.setString(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  StorageService.setString(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

/**
 * Load persisted tokens from MMKV storage.
 * Returns null for each token if it has never been stored.
 */
export function loadTokens(): LoadedTokens {
  return {
    accessToken: StorageService.getString(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: StorageService.getString(STORAGE_KEYS.REFRESH_TOKEN),
  };
}

/**
 * Remove all persisted auth tokens from MMKV storage.
 * Call this on logout or auth failure.
 */
export function clearTokens(): void {
  StorageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
  StorageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
}
