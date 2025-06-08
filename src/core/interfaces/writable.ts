/**
 * @module core.interfaces.writable
 */

/**
 * Describes a contract that allows for writing a value.
 *
 * @template T The type of the value accepted by `write`.
 * @memberof core.interfaces.writable
 */
export interface Writable<T> {
    write(value: T): void
}
