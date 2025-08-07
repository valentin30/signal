import { Emitter } from '@valentin30/signal/core/internal/emitter'
import { Value } from '@valentin30/signal/core/internal/value'

export class EmittingValue<T> {
    private readonly value: Value<T>

    private readonly emitter: Emitter

    constructor(value: Value<T>, emitter: Emitter) {
        this.value = value
        this.emitter = emitter
    }

    public read(): T {
        return this.value.read()
    }

    public write(value: T): boolean {
        const changed = this.value.write(value)
        if (changed) this.emitter.emit()
        return changed
    }

    public equals(other: T): boolean
    public equals(value: T, other: T): boolean
    public equals(...args: [T] | [T, T]): boolean {
        const [value, other] = args.length === 1 ? [this.read(), args[0]] : args
        return this.value.equals(value, other)
    }
}
