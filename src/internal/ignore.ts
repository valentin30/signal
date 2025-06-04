import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'

export function internal_ignore<Value>(value: ReadonlySignal<Value>): Value
export function internal_ignore<Value>(callback: () => Value): Value
export function internal_ignore<Value, Args extends any[]>(callback: (...args: Args) => Value, ...args: Args): Value
export function internal_ignore<Value, Args extends any[]>(
    callback: ((...args: Args) => Value) | ReadonlySignal<Value>,
    ...args: Args
): Value {
    let value: Value
    internal_ignore.collector().ignore(() => (value = typeof callback === 'function' ? callback(...args) : callback.read()))
    return value!
}

export namespace internal_ignore {
    export const collector = factory<collector.Factory>('signal.collector')
    export namespace collector {
        export type Factory = () => Collector<ReadonlySignal<unknown>>
    }
}
