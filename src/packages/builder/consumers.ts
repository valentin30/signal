import { Consumers } from '@valentin30/signal/core/interfaces/consumers'
import { ConsumersFactory } from '@valentin30/signal/modules/consumers/factory'

const factory = ConsumersFactory()

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Consumers } from '@valentin30/signal/core/interfaces/consumers'

export function consumers(): Consumers {
    return factory()
}
