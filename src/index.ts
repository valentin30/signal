import { Collector, collector, CollectorFactory } from '@valentin30/signal/core/collector'
import { composed, ComposedFactory } from '@valentin30/signal/core/composed'
import { computed, ComputedFactory } from '@valentin30/signal/core/computed'
import { effect, Effect } from '@valentin30/signal/core/effect'
import { ignore } from '@valentin30/signal/core/ignore'
import { ReadonlySignal, signal, SignalFactory } from '@valentin30/signal/core/signal'
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

export * from '@valentin30/signal/core/collector'
export * from '@valentin30/signal/core/composed'
export * from '@valentin30/signal/core/computed'
export * from '@valentin30/signal/core/effect'
export * from '@valentin30/signal/core/ignore'
export * from '@valentin30/signal/core/signal'

export { internal }

export interface Config {
    collector?: Maybe<CollectorFactory>
    signal?: Maybe<SignalFactory>
    effect?: Maybe<Effect>
    computed?: Maybe<ComputedFactory>
    composed?: Maybe<ComposedFactory>
}

export function config(config: Config = {}) {
    collector.factory(config.collector)
    signal.factory(config.signal)
    effect.factory(config.effect)
    computed.factory(config.computed)
    composed.factory(config.composed)
}

let __shared__: Maybe<Collector<ReadonlySignal<unknown>>> = null
function shared() {
    if (!__shared__) __shared__ = collector()
    return __shared__
}

internal.signal.collector.default(shared)
internal.effect.collector.default(shared)
internal.computed.collector.default(shared)
internal.composed.collector.default(shared)
internal.ignore.collector.default(shared)

signal.default(internal.signal)
ignore.default(internal.ignore)
effect.default(internal.effect)
collector.default(internal.collector)
computed.default(internal.computed)
composed.default(internal.composed)
