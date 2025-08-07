import { Comparable, Equals } from '@valentin30/signal/core/contracts/comparable'
import { Peekable } from '@valentin30/signal/core/contracts/peekable'
import { Readable } from '@valentin30/signal/core/contracts/readable'
import { Subscribable } from '@valentin30/signal/core/contracts/subscribable'
import { Writable } from '@valentin30/signal/core/contracts/writable'
import { configuration } from '@valentin30/signal/app'

export interface Signal<T> extends Readable<T>, Writable<T>, Comparable<T>, Peekable<T>, Subscribable {}
export interface ReadonlySignal<T> extends Readable<T>, Comparable<T>, Peekable<T>, Subscribable {}
export interface SignalFactory {
    <T>(value: T, equals?: Equals<T>): Signal<T>
}

export function signal<T>(value: T, equals?: Equals<T>): Signal<T> {
    return configuration().signal(value, equals)
}
