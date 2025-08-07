import { Batcher } from '@valentin30/signal/core/batch'
import { ComposedFactory } from '@valentin30/signal/core/composed'
import { ComputedFactory } from '@valentin30/signal/core/computed'
import { comparator } from '@valentin30/signal/core/contracts/comparable'
import { reader } from '@valentin30/signal/core/contracts/readable'
import { writer } from '@valentin30/signal/core/contracts/writable'
import { Ignore } from '@valentin30/signal/core/ignore'
import { Collector } from '@valentin30/signal/core/internal/collector'
import { DependencyTracker } from '@valentin30/signal/core/internal/dependency'
import { Scheduler } from '@valentin30/signal/core/internal/scheduler'
import { Tracker } from '@valentin30/signal/core/internal/tracker'
import { ReadonlySignal, SignalFactory } from '@valentin30/signal/core/signal'
import { Internal } from '@valentin30/signal/internal'
import { Callback } from '@valentin30/signal/types/callback'
import { utils } from '@valentin30/signal/utils'

export function configuration() {
    return __configuration__
}

const __configuration__ = {
    signal: utils.factory<SignalFactory>('@configuration.signal'),
    computed: utils.factory<ComputedFactory>('@configuration.computed'),
    composed: utils.factory<ComposedFactory>('@configuration.composed'),
    batcher: utils.factory<() => Batcher>('@configuration.batch'),
    ignorer: utils.factory<() => Ignore>('@configuration.ignore'),
    // Internal
    scheduler: utils.factory<() => Scheduler<Callback>>('@configuration.scheduler'),
    tracker: utils.factory<() => Tracker<ReadonlySignal<unknown>>>('@configuration.tracker'),
    collector: utils.factory<() => Collector<ReadonlySignal<unknown>>>('@configuration.collector'),
    dependency_tracker: utils.factory<() => DependencyTracker>('@configuration.dependency.tracker'),
    dependency_collector: utils.factory<() => Internal.CollectorController<ReadonlySignal<unknown>>>('@configuration.dependency.collector'),
    callback_collector: utils.factory<() => Internal.CollectorController<Callback>>('@configuration.callback.collector'),
}

__configuration__.signal.default((value, equals) => {
    const emitter = new Internal.ScheduledEmitter(configuration().scheduler())
    const state = new Internal.EmittingValue(new Internal.BasicValue(value, comparator(equals)), emitter)
    return new Internal.Reactive(state, configuration().tracker(), emitter)
})

__configuration__.computed.default((compute, equals) => {
    const dependency = configuration().dependency_tracker()
    const cache = new Internal.BasicValue(<ReturnType<typeof compute>>undefined, comparator(equals))
    const value = new Internal.ComputedValue(cache, reader(compute), dependency)
    return new Internal.Reactive(value, configuration().tracker(), dependency)
})

__configuration__.composed.default(
    (value, write) => new Internal.Composed(value, new Internal.BatchWriter(writer(write), configuration().batcher())),
)
__configuration__.batcher.default(utils.singleton(() => new Internal.CollectorBasedBatcher(configuration().callback_collector())))
__configuration__.ignorer.default(configuration().dependency_collector)
__configuration__.scheduler.default(utils.singleton(() => new Internal.CallbackScheduler(configuration().callback_collector())))
__configuration__.collector.default(configuration().dependency_collector)
__configuration__.tracker.default(configuration().dependency_collector)
__configuration__.dependency_tracker.default(() => new Internal.DependencyManager(configuration().collector()))
__configuration__.dependency_collector.default(utils.singleton(() => new Internal.CollectorController<ReadonlySignal<unknown>>()))
__configuration__.callback_collector.default(utils.singleton(() => new Internal.CollectorController<Callback>()))
