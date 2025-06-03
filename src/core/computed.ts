import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Equals } from '@valentin30/signal/core/types/equals'

export type ComputedFactory = <T>(read: () => T, equals?: Equals<T>) => ReadonlySignal<T>
export const computed = factory<ComputedFactory>('computed')
