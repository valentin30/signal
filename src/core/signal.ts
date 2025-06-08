import { Comparable } from '@valentin30/signal/core/interfaces/comparable'
import { factory } from '@valentin30/signal/core/factory'
import { Readable } from '@valentin30/signal/core/interfaces/readable'
import { Subscribable } from '@valentin30/signal/core/interfaces/subscribable'
import { Writable } from '@valentin30/signal/core/interfaces/writable'
import { Equals } from '@valentin30/signal/core/types/equals'
import { Peekable } from '@valentin30/signal/core/interfaces/peekable'

export interface Signal<T> extends Readable<T>, Writable<T>, Peekable<T>, Comparable<T>, Subscribable {}

/**
 * core/signal.ts
 */
export interface ReadonlySignal<T> extends Readable<T>, Peekable<T>, Comparable<T>, Subscribable {}

/**
 * core/signal.ts
 */
export type SignalFactory = <T>(value: T, equals?: Equals<T>) => Signal<T>

/**
 * core/signal.ts
 */
export const signal = factory<SignalFactory>('signal')
