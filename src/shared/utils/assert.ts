/**
 * Assert that a condition is true. Throws with the given message if not.
 * Useful for narrowing types without casting.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[Assert] ${message}`);
  }
}

/**
 * Assert that a value is not null or undefined.
 */
export function assertDefined<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`[Assert] ${message}`);
  }
}
