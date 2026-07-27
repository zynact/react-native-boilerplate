import { storage } from './mmkv';

/**
 * StorageService — a strongly-typed wrapper over MMKV.
 *
 * Rules:
 *  - Never use `any`
 *  - All keys must be string literals (use STORAGE_KEYS constants)
 *  - This is the only place raw MMKV is accessed
 */
export const StorageService = {
  // ── String ────────────────────────────────────────────────────────────────

  getString(key: string): string | null {
    return storage.getString(key) ?? null;
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  // ── Boolean ───────────────────────────────────────────────────────────────

  getBoolean(key: string): boolean | null {
    return storage.getBoolean(key) ?? null;
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  // ── Number ────────────────────────────────────────────────────────────────

  getNumber(key: string): number | null {
    return storage.getNumber(key) ?? null;
  },

  setNumber(key: string, value: number): void {
    storage.set(key, value);
  },

  // ── Utility ───────────────────────────────────────────────────────────────

  remove(key: string): void {
    storage.delete(key);
  },

  clear(): void {
    storage.clearAll();
  },
} as const;
