import { Collector, collector, CollectorFactoryFunction } from '@valentin30/signal/core/collector'
import { composed, ComposedFactoryFunction } from '@valentin30/signal/core/composed'
import { computed, ComputedFactoryFunction } from '@valentin30/signal/core/computed'
import { ReadonlySignal, signal, SignalFactoryFunction } from '@valentin30/signal/core/signal'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import * as internal from '@valentin30/signal/internal'

export * from '@valentin30/signal/core/interfaces/comparable'
export * from '@valentin30/signal/core/interfaces/reader'
export * from '@valentin30/signal/core/interfaces/subscription'
export * from '@valentin30/signal/core/interfaces/writer'

export * from '@valentin30/signal/core/types/callback'
export * from '@valentin30/signal/core/types/maybe'

export * from '@valentin30/signal/core/collector'
export * from '@valentin30/signal/core/composed'
export * from '@valentin30/signal/core/computed'
export * from '@valentin30/signal/core/signal'

export { internal }

export interface Config {
    collector?: Maybe<CollectorFactoryFunction>
    signal?: Maybe<SignalFactoryFunction>
    computed?: Maybe<ComputedFactoryFunction>
    composed?: Maybe<ComposedFactoryFunction>
}

export function config(config: Config = {}) {
    signal.factory(config.signal)
    collector.factory(config.collector)
    computed.factory(config.computed)
    composed.factory(config.composed)
}

let __shared__: Maybe<Collector<ReadonlySignal<unknown>>> = null
function shared() {
    if (!__shared__) __shared__ = collector()
    return __shared__
}

internal.signal.collector.default(shared)
internal.computed.collector.default(shared)
internal.composed.collector.default(shared)

signal.default(internal.signal)
collector.default(internal.collector)
computed.default(internal.computed)
composed.default(internal.composed)
