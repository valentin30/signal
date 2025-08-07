import { Subscribable } from '@valentin30/signal/core/contracts/subscribable'
import { Tracker } from '@valentin30/signal/core/internal/tracker'
import { Value } from '@valentin30/signal/core/internal/value'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/types/callback'

export class Reactive<T> implements Signal<T> {
    private readonly value: Value<T>

    private readonly tracker: Tracker<ReadonlySignal<unknown>>

    private readonly subscription: Subscribable

    constructor(value: Value<T>, tracker: Tracker<ReadonlySignal<unknown>>, subscription: Subscribable) {
        this.value = value
        this.tracker = tracker
        this.subscription = subscription
    }

    public read(): T {
        this.tracker.track(this)
        return this.peek()
    }

    public peek(): T {
        return this.value.read()
    }

    public write(value: T): boolean {
        return this.value.write(value)
    }

    public equals(other: T): boolean
    public equals(value: T, other: T): boolean
    public equals(...args: [T] | [T, T]): boolean {
        const [value, other] = args.length === 1 ? [this.read(), args[0]] : args
        return this.value.equals(value, other)
    }

    public subscribe(callback: Callback): Callback {
        return this.subscription.subscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        return this.subscription.unsubscribe(callback)
    }
}
