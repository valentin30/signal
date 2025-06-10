import { Comparable } from '@valentin30/signal/core/interfaces/comparable'
import { Reader } from '@valentin30/signal/core/interfaces/reader'
import { Writer } from '@valentin30/signal/core/interfaces/writer'

/**
 * @module core.interfaces.value
 */

/**
 * Represents a mutable value object that can be read, written to, and compared for equality.
 *
 * Combines the capabilities of {@link Reader}, {@link Writer}, and {@link Comparable}.
 *
 * @template T The type of the value.
 * @memberof core.interfaces.value
 */
export interface Value<T> extends Reader<T>, Writer<T>, Comparable<T> {}

/**
 * Represents an immutable (read-only) value object that can be read and compared for equality.
 *
 * Combines the capabilities of {@link Reader} and {@link Comparable}.
 *
 * @template T The type of the value.
 * @memberof core.interfaces.value
 */
export interface ReadonlyValue<T> extends Reader<T>, Comparable<T> {}
