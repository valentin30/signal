/**
 * Represents a function that compares two values for equality.
 *
 * @template T The type of the values to compare.
 * @param {T} value The value to compare.
 * @param {T} other The value to compare with.
 * @returns {boolean} `true` if the values are considered equal, `false` otherwise.
 */
export type Equals<T> = (value: T, other: T) => boolean
