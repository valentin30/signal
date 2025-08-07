import { Writable } from '@valentin30/signal/core/contracts/writable'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/types/callback'

export class Composed<T> implements Signal<T> {
    private readonly value: ReadonlySignal<T>

    private readonly writer: Writable<T>

    constructor(value: ReadonlySignal<T>, writer: Writable<T>) {
        this.value = value
        this.writer = writer
    }

    public read(): T {
        return this.value.read()
    }

    public peek(): T {
        return this.value.peek()
    }

    public write(value: T): boolean {
        if (this.value.equals(this.peek(), value)) return false
        return this.writer.write(value)
    }

    public equals(other: T): boolean
    public equals(value: T, other: T): boolean
    public equals(...args: [T] | [T, T]): boolean {
        const [value, other] = args.length === 1 ? [this.read(), args[0]] : args
        return this.value.equals(value, other)
    }

    public subscribe(callback: Callback): Callback {
        return this.value.subscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        return this.value.unsubscribe(callback)
    }
}
