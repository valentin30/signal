import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'

export type ComputedFactoryFunction = <T>(compute: () => T, equals?: Equals<T>) => ReadonlySignal<T>
export const computed = factory<ComputedFactoryFunction>('computed')
