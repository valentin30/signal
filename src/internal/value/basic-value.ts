import { Comparator } from '@valentin30/signal/core/contracts/comparable'
import { Value } from '@valentin30/signal/core/internal/value'

export class BasicValue<T> implements Value<T> {
    private value: T

    private readonly comparator: Comparator<T>

    constructor(value: T, comparator: Comparator<T>) {
        this.value = value
        this.comparator = comparator
    }

    public read(): T {
        return this.value
    }

    public write(value: T): boolean {
        if (this.comparator.equals(this.value, value)) return false
        this.value = value
        return true
    }

    public equals(other: T): boolean
    public equals(value: T, other: T): boolean
    public equals(...args: [T] | [T, T]): boolean {
        const [value, other] = args.length === 1 ? [this.read(), args[0]] : args
        return this.comparator.equals(value, other)
    }
}
