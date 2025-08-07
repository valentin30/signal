import { Collector } from '@valentin30/signal/core/internal/collector'
import { DependencyTracker } from '@valentin30/signal/core/internal/dependency'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/types/callback'
import { Maybe } from '@valentin30/signal/types/maybe'

export type Snapshot = [ReadonlySignal<unknown>, unknown]
export namespace Snapshot {
    export function changed([value, snapshot]: Snapshot): boolean {
        return !value.equals(value.peek(), snapshot)
    }

    export function from(values: Set<ReadonlySignal<unknown>>): Snapshot[] {
        if (!values.size) return []
        return Array.from(values).map(create)
    }

    function create(value: ReadonlySignal<unknown>): Snapshot {
        return [value, value.peek()]
    }
}

export class DependencyManager implements DependencyTracker {
    private snapshot: Maybe<Snapshot[]>

    private dependencies: Set<ReadonlySignal<unknown>>

    private readonly collector: Collector<ReadonlySignal<unknown>>

    private readonly listeners: Set<Callback>

    constructor(
        collector: Collector<ReadonlySignal<unknown>>,
        listeners: Set<Callback> = new Set(),
        dependencies: Set<ReadonlySignal<unknown>> = new Set(),
        snapshot: Maybe<Snapshot[]> = null,
    ) {
        this.collector = collector
        this.listeners = listeners
        this.dependencies = dependencies
        this.snapshot = snapshot
    }

    public changed(): boolean {
        if (!this.snapshot) return true
        return this.snapshot.some(Snapshot.changed)
    }

    public track(callback: Callback): void {
        const [_, dependencies] = this.collector.collect(callback)
        if (!this.dependencies.size && !dependencies.size) return

        this.snapshot = Snapshot.from(dependencies)

        if (this.equals(dependencies)) return

        if (this.listeners.size) {
            this.dependencies.forEach(dep => !dependencies.has(dep) && this.listeners.forEach(cb => dep.unsubscribe(cb)))
            dependencies.forEach(dep => !this.dependencies.has(dep) && this.listeners.forEach(cb => dep.subscribe(cb)))
        }

        this.dependencies = dependencies
    }

    public subscribe(callback: Callback): Callback {
        this.listeners.add(callback)
        this.dependencies.forEach(dep => dep.subscribe(callback))
        return () => this.unsubscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        this.listeners.delete(callback)
        this.dependencies.forEach(dep => dep.unsubscribe(callback))
    }

    private equals<T extends Set<unknown>>(other: T): boolean {
        if (this.dependencies === other) return true
        if (this.dependencies.size !== other.size) return false
        for (const item of this.dependencies) if (!other.has(item)) return false
        return true
    }
}
