// ─────────────────────────────────────────────────────────────────────────────
// Common utility types used across the app
// ─────────────────────────────────────────────────────────────────────────────

/** Makes specified keys required in T */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Makes specified keys optional in T */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extracts the value type of a Record */
export type ValueOf<T> = T[keyof T];

/** Generic async result type – avoids try/catch at call sites */
export type AsyncResult<T> = Promise<Result<T>>;

export type Result<T> = { success: true; data: T } | { success: false; error: AppError };

/** Base application error */
export interface AppError {
  code: string;
  message: string;
  statusCode?: number;
}

/** Nullable shorthand */
export type Nullable<T> = T | null;

/** Optional shorthand */
export type Maybe<T> = T | null | undefined;
