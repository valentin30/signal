import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Consumers } from '@valentin30/signal/core/interfaces/consumers'
import { Value } from '@valentin30/signal/core/interfaces/value'

export class Signal<T> implements Source, Value<T> {
    private readonly value: Value<T>

    private readonly consumers: Consumers

    private __v: number

    constructor(value: Value<T>, consumers: Consumers) {
        this.value = value
        this.consumers = consumers
        this.__v = 0
    }

    public read(): T {
        return this.value.read()
    }

    public write(value: T): boolean {
        if (!this.value.write(value)) return false
        this.__v++
        this.consumers.invalidate()
        return true
    }

    public compare(a: T, b: T): boolean {
        return this.value.compare(a, b)
    }

    public link(consumer: Consumer): void {
        return this.consumers.link(consumer)
    }

    public unlink(consumer: Consumer): void {
        return this.consumers.unlink(consumer)
    }

    public version(): number {
        return this.__v
    }
}
