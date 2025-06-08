/**
 * @module core.interfaces.readable
 */

/**
 * Describes a contract that allows for reading a value.
 *
 * @template T The type of the value returned by `read`.
 * @memberof core.interfaces.readable
 */
export interface Readable<T> {
    read(): T
}
