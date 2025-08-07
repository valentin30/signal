import { Callable } from '@valentin30/signal/types/callable'

export interface CollectorState {
    collecting(): boolean
}

export interface CollectorTarget<T> extends CollectorState {
    add(value: T): void
}

export interface Collector<T> extends CollectorState {
    collect<Value>(callback: () => Value): [Value, Readonly<Set<T>>]
    collect<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): [Value, Readonly<Set<T>>]
}
