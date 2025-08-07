import { Readable } from '@valentin30/signal/core/contracts/readable'
import { DependencyObserver } from '@valentin30/signal/core/internal/dependency'
import { Value } from '@valentin30/signal/core/internal/value'

export class ComputedValue<T> implements Value<T> {
    private readonly cache: Value<T>

    private readonly computation: Readable<T>

    private readonly dependencies: DependencyObserver

    constructor(cache: Value<T>, computation: Readable<T>, dependencies: DependencyObserver) {
        this.cache = cache
        this.computation = computation
        this.dependencies = dependencies
        this.recompute = this.recompute.bind(this)
    }

    public read(): T {
        if (this.dependencies.changed()) this.dependencies.track(this.recompute)
        return this.cache.read()
    }

    private recompute(): void {
        this.cache.write(this.computation.read())
    }

    public write(_: T): boolean {
        return false
    }

    public equals(other: T): boolean
    public equals(value: T, other: T): boolean
    public equals(...args: [T] | [T, T]): boolean {
        const [value, other] = args.length === 1 ? [this.read(), args[0]] : args
        return this.cache.equals(value, other)
    }
}
