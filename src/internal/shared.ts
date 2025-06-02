import { collector, Collector } from '@valentin30/signal/core/collector'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'

let __batcher__: Maybe<Collector<Callback>> = null
let __collector__: Maybe<Collector<ReadonlySignal<unknown>>> = null

export const shared = {
    batcher() {
        if (!__batcher__) __batcher__ = collector<Callback>()
        return __batcher__
    },
    collector() {
        if (!__collector__) __collector__ = collector<ReadonlySignal<unknown>>()
        return __collector__
    },
}
