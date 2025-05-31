import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Collector } from '@valentin30/signal/core/collector'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { factory } from '@valentin30/signal/core/factory'

export function computed<T>(compute: () => T, equals?: Equals<T>) {
    return new Computed<T>(
        true,
        undefined,
        [],
        new Set<ReadonlySignal<unknown>>(),
        new Set<Callback>(),
        computed.collector()!,
        compute,
        equals,
    )
}

export type ComputedCollectorFactory = () => Collector<ReadonlySignal<unknown>>
computed.collector = factory<ComputedCollectorFactory>('computed.collector')

export class Computed<T> implements ReadonlySignal<T> {
    private empty: boolean

    private value: T | undefined

    private values: [ReadonlySignal<unknown>, unknown][]

    private dependencies: Set<ReadonlySignal<unknown>>

    private readonly compute: () => T

    private readonly equalsFn: Maybe<Equals<T>>

    private readonly listeners: Set<Callback>

    private readonly collector: Collector<ReadonlySignal<unknown>>

    constructor(
        empty: boolean,
        value: T | undefined,
        values: [ReadonlySignal<unknown>, unknown][],
        dependencies: Set<ReadonlySignal<unknown>>,
        listeners: Set<Callback>,
        collector: Collector<ReadonlySignal<unknown>>,
        compute: () => T,
        equals: Maybe<Equals<T>>,
    ) {
        this.empty = empty
        this.value = value
        this.values = values
        this.dependencies = dependencies
        this.listeners = listeners
        this.collector = collector
        this.compute = compute
        this.equalsFn = equals
    }

    private dirty(): boolean {
        if (this.empty) return true
        return this.values.some(([dep, value]) => !dep.equals(value))
    }

    public read(): T {
        this.collector.add(this)

        if (!this.dirty()) return this.value!

        const current = this.dependencies
        const next = this.collector.collect(() => (this.value = this.compute()))
        this.dependencies = next
        this.values = Array.from(next).map(dep => [dep, dep.read()])
        this.empty = false

        if (!current.size && !next.size) return this.value!
        if (!this.listeners.size) return this.value!

        current.forEach(dep => !next.has(dep) && this.listeners.forEach(listener => dep.unsubscribe(listener)))
        next.forEach(dep => !current.has(dep) && this.listeners.forEach(listener => dep.subscribe(listener)))

        return this.value!
    }

    public equals(other: T): boolean {
        if (this.equalsFn) return this.equalsFn(this.read(), other)
        return this.read() === other
    }

    public subscribe(callback: Callback): Callback {
        this.listeners.add(callback)
        this.dependencies.forEach(dep => dep.subscribe(callback))
        return this.unsubscribe.bind(this, callback)
    }

    public unsubscribe(callback: Callback): void {
        this.listeners.delete(callback)
        this.dependencies.forEach(dep => dep.unsubscribe(callback))
    }
}
