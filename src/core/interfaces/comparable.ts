/**
 * `core.interfaces.comparable`
 *
 * Describes a contract that allows a value to compare itself with another.
 *
 * @template T The underlying value type.
 */
export interface Comparable<T> {
    /**
     * Compares itself to another value for equality.
     *
     * @param other The value to compare against.
     * @returns {boolean} `true` if the values are considered equal, `false` otherwise.
     */
    equals(other: T): boolean
}
