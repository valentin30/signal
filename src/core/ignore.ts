import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'

/**
 * core/ignore.ts
 */
export interface Ignore {
    <Value>(value: ReadonlySignal<Value>): Value
    <Value>(callback: () => Value): Value
    <Value, Args extends any[]>(callback: (...args: Args) => Value, ...args: Args): Value
}

/**
 * core/ignore.ts
 */
export const ignore = factory<Ignore>('ignore')
