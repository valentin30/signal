import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Consumers } from '@valentin30/signal/core/interfaces/consumers'
import { Sources } from '@valentin30/signal/core/interfaces/sources'
import { Value } from '@valentin30/signal/core/interfaces/value'

export class Computed<T> implements Source, Consumer, Value<T> {
    private invalidated: boolean

    private readonly value: Value<T>

    private readonly sources: Sources<T>

    private readonly consumers: Consumers

    private __v: number

    constructor(value: Value<T>, sources: Sources<T>, consumers: Consumers) {
        this.invalidated = true
        this.value = value
        this.sources = sources
        this.consumers = consumers
        this.__v = 0
    }

    public dirty(): boolean {
        if (this.consumers.active()) return this.invalidated
        return this.sources.changed()
    }

    public read(): T {
        if (this.dirty()) {
            this.invalidated = false
            this.value.write(this.sources.compute())
        }
        return this.value.read()
    }

    public write(): boolean {
        return false
    }

    public compare(a: T, b: T): boolean {
        return this.value.compare(a, b)
    }

    public invalidate(): void {
        if (this.invalidated) return
        this.invalidated = true
        this.__v++
        this.consumers.invalidate()
    }

    public link(consumer: Consumer): void {
        if (!this.consumers.active()) this.sources.link(this)
        this.consumers.link(consumer)
    }

    public unlink(consumer: Consumer): void {
        this.consumers.unlink(consumer)
        if (this.consumers.active()) return
        this.sources.unlink(this)
    }

    public version(): number {
        return this.__v
    }
}
