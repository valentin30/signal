/**
 * @module core.interfaces.peekable
 */

/**
 * Describes a contract that allows for peeking at a value.
 *
 * @template T The type of the value returned by `peek`.
 * @memberof core.interfaces.peekable
 */
export interface Peekable<T> {
    peek(): T
}
