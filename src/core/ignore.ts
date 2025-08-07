import { configuration } from '@valentin30/signal/app'
import { Callable } from '@valentin30/signal/types/callable'

export interface Ignore {
    ignore<Value>(callback: () => Value): Value
    ignore<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
}

export function ignore<Value>(callback: () => Value): Value
export function ignore<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
export function ignore<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value {
    return configuration()
        .ignorer()
        .ignore(callback, ...args)
}
