import { factory } from '@valentin30/signal/core/factory'
import { Signal } from '@valentin30/signal/core/signal'
import { Equals } from '@valentin30/signal/core/types/equals'

/**
 * core/composed.ts
 */
export type ComposedFactory = <T>(read: () => T, write: (value: T) => void, equals?: Equals<T>) => Signal<T>

/**
 * core/composed.ts
 */
export const composed = factory<ComposedFactory>('composed')
