import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { Signal as ISignal, ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export type SignalBatcherFactory = () => Collector<Callback>
export type SignalCollectorFactory = () => Collector<ReadonlySignal<unknown>>

export function signal<T>(value: T, equals?: Equals<T>): ISignal<T> {
    return new Signal<T>(value, equals, new Set<Callback>(), signal.batcher(), signal.collector())
}

signal.batcher = factory<SignalBatcherFactory>('signal.batcher')
signal.collector = factory<SignalCollectorFactory>('signal.collector')

export class Signal<T> implements ISignal<T> {
    #value: T

    readonly #equals: Maybe<Equals<T>>

    readonly #listeners: Set<Callback>

    readonly #batcher: Collector<Callback>

    readonly #collector: Collector<ReadonlySignal<unknown>>

    constructor(
        value: T,
        equals: Maybe<Equals<T>>,
        listeners: Set<Callback>,
        batcher: Collector<Callback>,
        collector: Collector<ReadonlySignal<unknown>>,
    ) {
        this.#value = value
        this.#equals = equals
        this.#listeners = listeners
        this.#batcher = batcher
        this.#collector = collector
    }

    public read(): T {
        this.#collector.add(this)
        return this.#value
    }

    public write(value: T): void {
        if (this.equals(value)) return
        this.#value = value
        if (this.#batcher.collecting()) this.#listeners.forEach(listener => this.#batcher.add(listener))
        else this.#listeners.forEach(listener => listener())
    }

    public equals(other: T): boolean {
        if (this.#equals) return this.#equals(this.#value, other)
        return this.#value === other
    }

    public subscribe(callback: Callback): Callback {
        this.#listeners.add(callback)
        return this.unsubscribe.bind(this, callback)
    }

    public unsubscribe(callback: Callback): void {
        this.#listeners.delete(callback)
    }
}
