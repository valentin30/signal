import { configuration } from '@valentin30/signal/app'
import { Equals } from '@valentin30/signal/core/contracts/comparable'
import { ReadonlySignal } from '@valentin30/signal/core/signal'

export interface ComputedFactory {
    <T>(compute: () => T, equals?: Equals<T>): ReadonlySignal<T>
}

export function computed<T>(compute: () => T, equals?: Equals<T>): ReadonlySignal<T> {
    return configuration().computed(compute, equals)
}
