/**
 * @module core.interfaces.reader
 */

/**
 * Describes a contract that allows for reading a value.
 *
 * @template T The type of the value returned by `read`.
 * @memberof core.interfaces.reader
 */
export interface Reader<T> {
    read(): T
}
