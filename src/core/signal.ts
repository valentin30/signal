import { Comparable, Equals } from '@valentin30/signal/core/interfaces/comparable'
import { factory } from '@valentin30/signal/core/factory'
import { Reader } from '@valentin30/signal/core/interfaces/reader'
import { Subscription } from '@valentin30/signal/core/interfaces/subscription'
import { Writer } from '@valentin30/signal/core/interfaces/writer'

export interface Signal<T> extends Reader<T>, Writer<T>, Comparable<T>, Subscription {}
export interface ReadonlySignal<T> extends Reader<T>, Comparable<T>, Subscription {}
export type SignalFactoryFunction = <T>(value: T, equals?: Equals<T>) => Signal<T>
export const signal = factory<SignalFactoryFunction>('signal')
