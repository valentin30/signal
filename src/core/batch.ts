import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * @module core.batch
 */

/**
 * Represents a function that executes a callback in a batched context.
 *
 * Executes the given `callback`, collects any side-effect callbacks (e.g., observers),
 * and invokes them after the batch completes. This prevents redundant recomputation
 * or notification during intermediate state changes.
 *
 * Optionally, a custom `collector` can be provided to override the configured collector
 * used during batching. This is useful for isolating collection scopes or for testing.
 *
 * @param callback The function to execute within the batch context.
 * @param collector Optional custom collector to use instead of the configured one.
 * @memberof core.batch
 *
 */
export interface Batch {
    (callback: Callback): void
    (callback: Callback, collector: Collector<Callback>): void
    (callback: Callback, collector?: Collector<Callback>): void
}

/**
 * A configurable factory function for creating batched execution contexts.
 *
 * When invoked, it will invoke the configured function.
 * If factory function is not configured, it will fallback to a default factory function.
 * If default factory function is not configured, an error will be thrown.
 *
 * @memberof core.batch
 */
export const batch = factory<Batch>('batch')
