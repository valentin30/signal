import { Write } from '@valentin30/signal/core/contracts/writable'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { configuration } from '@valentin30/signal/app'

export interface ComposedFactory {
    <T>(value: ReadonlySignal<T>, write: Write<T>): Signal<T>
}

export function composed<T>(value: ReadonlySignal<T>, write: Write<T>): Signal<T> {
    return configuration().composed(value, write)
}
