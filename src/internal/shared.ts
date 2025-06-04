import { collector as create, Collector } from '@valentin30/signal/core/collector'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export namespace internal_shared {
    let __batcher__: Maybe<Collector<Callback>> = null
    let __collector__: Maybe<Collector<ReadonlySignal<unknown>>> = null

    export function batcher() {
        if (!__batcher__) __batcher__ = create<Callback>()
        return __batcher__
    }

    export function collector() {
        if (!__collector__) __collector__ = create<ReadonlySignal<unknown>>()
        return __collector__
    }
}
