import { configuration } from '@valentin30/signal/app'
import { Callable } from '@valentin30/signal/types/callable'

export interface Batcher {
    batch<Value>(callback: () => Value): Value
    batch<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
}

export function batch<Value>(callback: () => Value): Value
export function batch<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
export function batch<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value {
    return configuration()
        .batcher()
        .batch(callback, ...args)
}
