import RNConfig from 'react-native-config';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AppEnvironment = 'development' | 'staging' | 'production';

interface AppConfig {
  APP_ENV: AppEnvironment;
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_STORYBOOK: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

function requireString(key: string, fallback?: string): string {
  const value = (RNConfig as Record<string, string | undefined>)[key] ?? fallback;
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function requireEnum<T extends string>(key: string, allowed: readonly T[], fallback?: T): T {
  const raw = ((RNConfig as Record<string, string | undefined>)[key] ?? fallback) as
    | string
    | undefined;
  if (!raw || !allowed.includes(raw as T)) {
    throw new Error(
      `[Config] Invalid value for ${key}: "${raw ?? ''}". Must be one of: ${allowed.join(', ')}`,
    );
  }
  return raw as T;
}

function optionalBoolean(key: string, fallback: boolean): boolean {
  const raw = (RNConfig as Record<string, string | undefined>)[key];
  if (raw === undefined || raw === null) return fallback;
  return raw === 'true' || raw === '1';
}

function optionalNumber(key: string, fallback: number): number {
  const raw = (RNConfig as Record<string, string | undefined>)[key];
  if (raw === undefined || raw === null) return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`[Config] Invalid number for ${key}: "${raw}"`);
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validated config – throws at startup if any required variable is missing
// ─────────────────────────────────────────────────────────────────────────────

const APP_ENVIRONMENTS = ['development', 'staging', 'production'] as const;

export const appConfig: AppConfig = {
  APP_ENV: requireEnum('APP_ENV', APP_ENVIRONMENTS, 'development'),
  API_BASE_URL: requireString('API_BASE_URL'),
  API_TIMEOUT: optionalNumber('API_TIMEOUT', 30000),
  ENABLE_STORYBOOK: optionalBoolean('ENABLE_STORYBOOK', false),
};

// ─────────────────────────────────────────────────────────────────────────────
// Convenience helpers
// ─────────────────────────────────────────────────────────────────────────────

export const isDevelopment = appConfig.APP_ENV === 'development';
export const isStaging = appConfig.APP_ENV === 'staging';
export const isProduction = appConfig.APP_ENV === 'production';
