import { factory } from '@valentin30/signal/core/factory'
import { Comparable } from '@valentin30/signal/core/interfaces/comparable'
import { Peekable } from '@valentin30/signal/core/interfaces/peekable'
import { Reader } from '@valentin30/signal/core/interfaces/reader'
import { Subscribable } from '@valentin30/signal/core/interfaces/subscribable'
import { Writer } from '@valentin30/signal/core/interfaces/writer'
import { Equals } from '@valentin30/signal/core/types/equals'

export interface Signal<T> extends Reader<T>, Writer<T>, Peekable<T>, Comparable<T>, Subscribable {}

/**
 * core/signal.ts
 */
export interface ReadonlySignal<T> extends Reader<T>, Peekable<T>, Comparable<T>, Subscribable {}

/**
 * core/signal.ts
 */
export type SignalFactory = <T>(value: T, equals?: Equals<T>) => Signal<T>

/**
 * core/signal.ts
 */
export const signal = factory<SignalFactory>('signal')
