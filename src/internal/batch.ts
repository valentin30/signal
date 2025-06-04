import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

export function internal_batch(callback: Callback): void
export function internal_batch(callback: Callback, collector: Collector<Callback>): void
export function internal_batch(callback: Callback, collector?: Collector<Callback>): void
export function internal_batch(callback: Callback, collector: Collector<Callback> = internal_batch.collector()) {
    if (collector.collecting()) return callback()
    collector.collect(callback).forEach(listener => listener())
}
export namespace internal_batch {
    export const collector = factory<collector.Factory>('batch.collector')
    export namespace collector {
        export type Factory = () => Collector<Callback>
    }
}
