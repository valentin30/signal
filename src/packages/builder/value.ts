import { Value } from '@valentin30/signal/core/interfaces/value'
import { strict_compare } from '@valentin30/signal/modules/common/utils/compare'
import { ValueFactory } from '@valentin30/signal/modules/value/factory'

const factory = ValueFactory(strict_compare)

export type { Value } from '@valentin30/signal/core/interfaces/value'

export function value<T>(value: T): Value<T> {
    return factory(value)
}
