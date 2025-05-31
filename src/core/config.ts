import { batch, Batch } from '@valentin30/signal/core/batch'
import { collector, CollectorFactory } from '@valentin30/signal/core/collector'
import { composed, ComposedFactory } from '@valentin30/signal/core/composed'
import { computed, ComputedFactory } from '@valentin30/signal/core/computed'
import { effect, Effect } from '@valentin30/signal/core/effect'
import { ignore } from '@valentin30/signal/core/ignore'
import { signal, SignalFactory } from '@valentin30/signal/core/signal'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { Ignore } from '@valentin30/signal/internal'

export interface Config {
    collector?: Maybe<CollectorFactory>
    signal?: Maybe<SignalFactory>
    computed?: Maybe<ComputedFactory>
    composed?: Maybe<ComposedFactory>
    effect?: Maybe<Effect>
    batch?: Maybe<Batch>
    ignore?: Maybe<Ignore>
}

export function config(config: Config = {}) {
    collector.factory(config.collector)
    signal.factory(config.signal)
    computed.factory(config.computed)
    composed.factory(config.composed)
    effect.factory(config.effect)
    batch.factory(config.batch)
    ignore.factory(config.ignore)
}
