import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * internal/batch.ts
 */
export function internal_batch(callback: Callback): void
export function internal_batch(callback: Callback, collector: Collector<Callback>): void
export function internal_batch(callback: Callback, collector?: Collector<Callback>): void
export function internal_batch(callback: Callback, collector: Collector<Callback> = internal_batch.collector()) {
    if (collector.collecting()) return callback()
    collector.collect(callback).forEach(listener => listener())
}

/**
 * internal/batch.ts
 */
export namespace internal_batch {
    export type CollectorFactory = () => Collector<Callback>
    export const collector = factory<CollectorFactory>('batch.collector')
}
