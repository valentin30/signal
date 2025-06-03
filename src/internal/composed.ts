import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { Computed } from '@valentin30/signal/internal/computed'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { batch } from '@valentin30/signal/core/batch'
import { Equals } from '@valentin30/signal/core/types/equals'

export type ComposedBatcherFactory = () => Collector<Callback>
export type ComposedCollectorFactory = () => Collector<ReadonlySignal<unknown>>
export function composed<T>(compute: () => T, write: (value: T) => void, equals?: Equals<T>) {
    return new Composed<T>(
        true,
        undefined,
        [],
        new Set<ReadonlySignal<unknown>>(),
        new Set<Callback>(),
        composed.batcher(),
        composed.collector(),
        compute,
        write,
        equals,
    )
}

composed.batcher = factory<ComposedBatcherFactory>('composed.batcher')
composed.collector = factory<ComposedCollectorFactory>('composed.collector')

export class Composed<T> extends Computed<T> implements Signal<T> {
    readonly #batcher: Collector<Callback>

    readonly #write: (value: T) => void

    constructor(
        empty: boolean,
        value: T | undefined,
        values: [ReadonlySignal<unknown>, unknown][],
        dependencies: Set<ReadonlySignal<unknown>>,
        listeners: Set<Callback>,
        batcher: Collector<Callback>,
        collector: Collector<ReadonlySignal<unknown>>,
        compute: () => T,
        write: (value: T) => void,
        equals: Maybe<Equals<T>>,
    ) {
        super(empty, value, values, dependencies, listeners, collector, compute, equals)
        this.#batcher = batcher
        this.#write = write
    }

    public write(value: T): void {
        if (this.equals(value)) return
        batch(() => this.#write(value), this.#batcher)
    }
}
