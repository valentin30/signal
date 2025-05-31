import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { Signal as ISignal, ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export function signal<T>(value: T, equals?: Equals<T>): ISignal<T> {
    return new Signal<T>(value, equals, new Set<Callback>(), signal.collector())
}

export type SignalCollectorFactory = () => Maybe<Collector<ReadonlySignal<unknown>>>
signal.collector = factory<SignalCollectorFactory>('signal.collector')

export class Signal<T> implements ISignal<T> {
    private value: T

    private equalsFn: Maybe<Equals<T>>

    private listeners: Set<Callback>

    private collector: Maybe<Collector<ReadonlySignal<unknown>>>

    constructor(value: T, equals: Maybe<Equals<T>>, listeners: Set<Callback>, collector: Maybe<Collector<ReadonlySignal<unknown>>>) {
        this.value = value
        this.equalsFn = equals
        this.listeners = listeners
        this.collector = collector
    }

    public read(): T {
        if (this.collector) this.collector.add(this)
        return this.value
    }

    public write(value: T): void {
        if (this.equals(value)) return
        this.value = value
        this.listeners.forEach(listener => listener())
    }

    public equals(other: T): boolean {
        if (this.equalsFn) return this.equalsFn(this.value, other)
        return this.value === other
    }

    public subscribe(callback: Callback): Callback {
        this.listeners.add(callback)
        return () => this.unsubscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        this.listeners.delete(callback)
    }
}
