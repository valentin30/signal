import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Equals } from '@valentin30/signal/core/types/equals'

/**
 * core/computed.ts
 */
export type ComputedFactory = <T>(read: () => T, equals?: Equals<T>) => ReadonlySignal<T>

/**
 * core/computed.ts
 */
export const computed = factory<ComputedFactory>('computed')
