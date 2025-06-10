/**
 * @module core.interfaces.writer
 */

/**
 * Describes a contract that allows for writing a value.
 *
 * @template T The type of the value accepted by `write`.
 * @memberof core.interfaces.writer
 */
export interface Writer<T> {
    /**
     *  Writes a value.
     *
     * @param value The value to write.
     * @returns {boolean} `true` if the write operation was successful, `false` otherwise.
     */
    write(value: T): boolean
}
