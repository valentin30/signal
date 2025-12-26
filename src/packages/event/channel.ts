import { Source } from '@valentin30/signal/core/contracts/source'
import { Channel } from '@valentin30/signal/modules/event/channel'
import { ChannelFactory } from '@valentin30/signal/modules/event/channel'
import { dequeue, enqueue } from '@valentin30/signal/runtime/scheduler'

const factory = ChannelFactory(enqueue, dequeue)

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Channel } from '@valentin30/signal/modules/event/channel'
export type { Disposable } from '@valentin30/signal/modules/common/contracts/disposable'
export type { Subscriber } from '@valentin30/signal/modules/common/contracts/subscriber'
export type { Callback } from '@valentin30/signal/modules/common/types/callback'

export function channel(...sources: Source[]): Channel {
    return factory(...sources)
}
