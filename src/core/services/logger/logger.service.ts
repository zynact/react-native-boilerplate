import { isDevelopment } from '@core/config';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  context?: string;
  message: string;
  error?: unknown;
  timestamp: string;
}

interface ContextLogger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, error?: unknown) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatMessage(level: LogLevel, message: string, context?: string): string {
  const tag = `[${level.toUpperCase()}]`;
  const ctx = context !== undefined ? ` [${context}]` : '';
  return `${tag}${ctx} ${message}`;
}

function log(entry: LogEntry): void {
  // In production, skip debug and info
  if (!isDevelopment && (entry.level === 'debug' || entry.level === 'info')) {
    return;
  }

  const formatted = formatMessage(entry.level, entry.message, entry.context);

  if (entry.level === 'error') {
    if (entry.error !== undefined) {
      console.error(formatted, entry.error);
    } else {
      console.error(formatted);
    }
  } else if (entry.level === 'warn') {
    console.warn(formatted);
  } else {
    // debug and info – only reached in development
    console.warn(formatted);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Logger
// ─────────────────────────────────────────────────────────────────────────────

function debug(message: string, context?: string): void {
  log({
    level: 'debug',
    context,
    message,
    timestamp: new Date().toISOString(),
  });
}

function info(message: string, context?: string): void {
  log({
    level: 'info',
    context,
    message,
    timestamp: new Date().toISOString(),
  });
}

function warn(message: string, context?: string): void {
  log({
    level: 'warn',
    context,
    message,
    timestamp: new Date().toISOString(),
  });
}

function error(message: string, err?: unknown, context?: string): void {
  log({
    level: 'error',
    context,
    message,
    error: err,
    timestamp: new Date().toISOString(),
  });
}

function createContext(ctx: string): ContextLogger {
  return {
    debug: (message: string) => debug(message, ctx),
    info: (message: string) => info(message, ctx),
    warn: (message: string) => warn(message, ctx),
    error: (message: string, err?: unknown) => error(message, err, ctx),
  };
}

export const logger = {
  debug,
  info,
  warn,
  error,
  createContext,
};
