import { Ignore } from '@valentin30/signal/core/ignore'
import { Collector, CollectorState, CollectorTarget } from '@valentin30/signal/core/internal/collector'
import { Tracker } from '@valentin30/signal/core/internal/tracker'
import { Callable } from '@valentin30/signal/types/callable'
import { Maybe } from '@valentin30/signal/types/maybe'

export class CollectorController<T> implements Collector<T>, CollectorTarget<T>, CollectorState, Ignore, Tracker<T> {
    private values: Maybe<Set<T>>

    constructor(values: Maybe<Set<T>> = null) {
        this.values = values
    }

    public collecting(): boolean {
        return !!this.values
    }

    public add(value: T): void {
        if (!this.values) return
        this.values.add(value)
    }

    public track(value: T): void {
        if (!this.values) return
        this.values.add(value)
    }

    public collect<Value>(callback: () => Value): [Value, Readonly<Set<T>>]
    public collect<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): [Value, Readonly<Set<T>>]
    public collect<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): [Value, Readonly<Set<T>>] {
        const current = this.values
        this.values = new Set<T>()
        const response: [Value, Readonly<Set<T>>] = [] as any
        try {
            response[0] = callback(...args)
        } finally {
            response[1] = this.values
            this.values = current
            return response
        }
    }

    public ignore<Value>(callback: () => Value): Value
    public ignore<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
    public ignore<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value {
        const current = this.values
        this.values = null
        try {
            return callback(...args)
        } finally {
            this.values = current
        }
    }
}
