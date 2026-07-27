import { useMemo } from 'react';

import { parseApiError } from '@core/api';

/**
 * useApiError — converts an RTK Query error to a user-friendly message string.
 *
 * Returns `null` when `error` is `undefined` or `null` (no error state).
 * Returns a human-readable string for all FetchBaseQueryError and
 * SerializedError shapes via parseApiError.
 *
 * @example
 *   const [login, { error }] = useLoginMutation();
 *   const errorMessage = useApiError(error);
 *
 *   if (errorMessage) {
 *     return <Text>{errorMessage}</Text>;
 *   }
 */
export function useApiError(error: unknown): string | null {
  return useMemo(() => {
    if (error === undefined || error === null) {
      return null;
    }
    return parseApiError(error).message;
  }, [error]);
}
