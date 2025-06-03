import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'

export interface Ignore {
    <Value>(value: ReadonlySignal<Value>): Value
    <Value>(callback: () => Value): Value
    <Value, Args extends any[]>(callback: (...args: Args) => Value, ...args: Args): Value
}

export function ignore<Value>(value: ReadonlySignal<Value>): Value
export function ignore<Value>(callback: () => Value): Value
export function ignore<Value, Args extends any[]>(callback: (...args: Args) => Value, ...args: Args): Value
export function ignore<Value, Args extends any[]>(callback: ((...args: Args) => Value) | ReadonlySignal<Value>, ...args: Args): Value {
    let value: Value
    ignore.collector().ignore(() => (value = typeof callback === 'function' ? callback(...args) : callback.read()))
    return value!
}

export type IgnoreCollectorFactory = () => Collector<ReadonlySignal<unknown>>
ignore.collector = factory<IgnoreCollectorFactory>('signal.collector')
