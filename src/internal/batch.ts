import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

export function batch(callback: Callback): void
export function batch(callback: Callback, collector: Collector<Callback>): void
export function batch(callback: Callback, collector?: Collector<Callback>): void
export function batch(callback: Callback, collector: Collector<Callback> = batch.collector()) {
    if (collector.collecting()) return callback()
    collector.collect(callback).forEach(listener => listener())
}

export type BatchCollectorFactory = () => Collector<Callback>
batch.collector = factory<BatchCollectorFactory>('batch.collector')
