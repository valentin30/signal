import { Collector as ICollector } from '@valentin30/signal/core/collector'

export function collector<T>(): ICollector<T> {
    return new Collector<T>(null)
}

export class Collector<T> implements ICollector<T> {
    private values: Set<T> | null

    constructor(values: Set<T> | null) {
        this.values = values
    }

    public collecting(): boolean {
        return this.values !== null
    }

    public add(value: T): void {
        if (!this.values) return
        this.values.add(value)
    }

    public collect(callback: () => void): Set<T> {
        const current = this.values
        this.values = new Set<T>()
        callback()
        const collected = this.values
        this.values = current
        return collected
    }

    public ignore(callback: () => void): void {
        const current = this.values
        this.values = null
        callback()
        this.values = current
    }
}
