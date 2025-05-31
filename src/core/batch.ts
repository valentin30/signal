import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

export interface Batch {
    (callback: Callback): void
    (callback: Callback, collector: Collector<Callback>): void
    (callback: Callback, collector?: Collector<Callback>): void
}
export const batch = factory<Batch>('batch')
