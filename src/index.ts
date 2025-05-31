import { batch } from '@valentin30/signal/core/batch'
import { Collector, collector } from '@valentin30/signal/core/collector'
import { composed } from '@valentin30/signal/core/composed'
import { computed } from '@valentin30/signal/core/computed'
import { effect } from '@valentin30/signal/core/effect'
import { ignore } from '@valentin30/signal/core/ignore'
import { ReadonlySignal, signal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import * as internal from '@valentin30/signal/internal'

export * from '@valentin30/signal/core/interfaces/comparable'
export * from '@valentin30/signal/core/interfaces/reader'
export * from '@valentin30/signal/core/interfaces/subscription'
export * from '@valentin30/signal/core/interfaces/writer'

export * from '@valentin30/signal/core/types/arguments'
export * from '@valentin30/signal/core/types/callback'
export * from '@valentin30/signal/core/types/function'
export * from '@valentin30/signal/core/types/maybe'

export * from '@valentin30/signal/core/batch'
export * from '@valentin30/signal/core/collector'
export * from '@valentin30/signal/core/composed'
export * from '@valentin30/signal/core/computed'
export * from '@valentin30/signal/core/effect'
export * from '@valentin30/signal/core/factory'
export * from '@valentin30/signal/core/ignore'
export * from '@valentin30/signal/core/signal'

export * from '@valentin30/signal/core/config'

export { internal }

let __collector__: Maybe<Collector<ReadonlySignal<unknown>>> = null
function shared_collector() {
    if (!__collector__) __collector__ = collector()
    return __collector__
}

internal.signal.collector.default(shared_collector)
internal.computed.collector.default(shared_collector)
internal.composed.collector.default(shared_collector)
internal.effect.collector.default(shared_collector)
internal.ignore.collector.default(shared_collector)

let __batcher__: Maybe<Collector<Callback>> = null
function shared_batcher() {
    if (!__batcher__) __batcher__ = collector<Callback>()
    return __batcher__
}

internal.signal.batcher.default(shared_batcher)
internal.composed.batcher.default(shared_batcher)
internal.batch.collector.default(shared_batcher)

collector.default(internal.collector)
signal.default(internal.signal)
computed.default(internal.computed)
composed.default(internal.composed)
effect.default(internal.effect)
batch.default(internal.batch)
ignore.default(internal.ignore)
