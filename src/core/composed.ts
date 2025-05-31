import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { factory } from '@valentin30/signal/core/factory'
import { Signal } from '@valentin30/signal/core/signal'

export type ComposedFactory = <T>(read: () => T, write: (value: T) => void, equals?: Equals<T>) => Signal<T>
export const composed = factory<ComposedFactory>('composed')
