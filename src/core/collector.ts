import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * @module core.collector
 */

/**
 * Describes a contract for collecting values of type `T` during controlled execution scopes.
 *
 * A `Collector` enables temporarily collecting values via `add()` while executing a callback
 * inside `collect()`. It supports nested collection and temporary suppression via `ignore()`.
 *
 * Typical use cases include dependency tracking, change detection, or dynamic relationship collection.
 *
 * @template T The type of values being collected.
 * @memberof core.collector
 */
export interface Collector<T> {
    /**
     * Add the given value to the collectors active collection.
     *
     * If the collector is not currently collecting, value will be ignored.
     *
     * @param value The value to add to the collector.
     */
    add(value: T): void

    /**
     * Check if the collector is currently collecting values.
     *
     * @returns `true` if the collector is currently collecting, `false` otherwise.
     */
    collecting(): boolean

    /**
     * Collect all values added to the collector during the given `callback` execution.
     *
     * If a collection is already active, it will be temporarily paused and
     * resumed after the callback completes.
     * @param callback The callback to collect values from.
     * @returns A read-only set of collected values.
     *
     * @example
     * ```ts
     * const collector = collector<number>()
     * // [1, 2, 4]
     * const values = collector.collect(() => {
     *     collector.add(1)
     *     collector.add(2)
     *     // [3]
     *     const values = collector.collect(() => {
     *        collector.add(3)
     *     })
     *     collector.add(4)
     * })
     * ```
     */
    collect(callback: Callback): Readonly<Set<T>>

    /**
     * Ignore all `add` calls made during the given `callback` execution.
     * @param callback The callback to ignore.
     * @example
     * ```ts
     * const collector = collector<number>()
     * // [1, 2, 4]
     * const values = collector.collect(() => {
     *     collector.add(1)
     *     collector.add(2)
     *     collector.ignore(() => {
     *        collector.add(3)
     *     })
     *     collector.add(4)
     * })
     * ```
     */
    ignore(callback: Callback): void
}

/**
 * Represents a factory function that creates a `Collector` instance.
 * @template T The type of values the collector will handle.
 * @returns A new collector instance that can collect values of type `T`.
 * @memberof core.collector
 */
export type CollectorFactory = <T>() => Collector<T>

/**
 * A factory function for creating `Collector` instances.
 *
 * When invoked, it will invoke the configured function.
 * If factory function is not configured, it will fallback to a default factory function.
 * If default factory function is not configured, an error will be thrown.
 * @memberof core.collector
 */
export const collector = factory<CollectorFactory>('collector')
