import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Collector } from '@valentin30/signal/core/collector'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { factory } from '@valentin30/signal/core/factory'

export function computed<T>(compute: () => T, equals?: Equals<T>) {
    if (!computed.collector()) {
        throw new Error('computed: collector is not configured.')
    }
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
computed.collector = factory<ComputedCollectorFactoryFunction>('computed.collector')

export interface ComputedCollectorFactoryFunction {
    (): Maybe<Collector<ReadonlySignal<unknown>>>
}

export class Computed<T> implements ReadonlySignal<T> {
    private empty: boolean

    private value: T | undefined

    private values: unknown[]

    private dependencies: Set<ReadonlySignal<unknown>>

    private readonly compute: () => T

    private readonly equalsFn: Maybe<Equals<T>>

    private readonly listeners: Set<Callback>

    private readonly collector: Collector<ReadonlySignal<unknown>>

    constructor(
        empty: boolean,
        value: T | undefined,
        values: unknown[],
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
        return Array.from(this.dependencies).some((dependency, index) => !dependency.equals(this.values![index]))
    }

    public read(): T {
        this.collector.add(this)

        if (!this.dirty()) return this.value!

        const current = this.dependencies
        const next = this.collector.collect(() => {
            this.value = this.compute()
        })

        this.dependencies = next
        this.values = Array.from(this.dependencies).map(dependency => dependency.read())
        this.empty = false

        if (!current.size && !next.size) return this.value!
        if (!this.listeners.size) return this.value!

        // Unsubscribe from old dependencies
        current.forEach(dependency => {
            if (next.has(dependency)) return
            this.listeners.forEach(listener => dependency.unsubscribe(listener))
        })

        // Subscribe to new dependencies
        next.forEach(dependency => {
            if (current.has(dependency)) return
            this.listeners.forEach(listener => dependency.subscribe(listener))
        })

        return this.value!
    }

    public equals(other: T): boolean {
        if (this.equalsFn) return this.equalsFn(this.read(), other)
        return this.read() === other
    }

    public subscribe(callback: Callback): Callback {
        this.listeners.add(callback)
        this.dependencies.forEach(dependency => dependency.subscribe(callback))
        return () => this.unsubscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        this.listeners.delete(callback)
        this.dependencies.forEach(dependency => dependency.unsubscribe(callback))
    }
}
