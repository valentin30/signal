import { Source } from '@valentin30/signal/core/contracts/source'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { NotifierFactory } from '@valentin30/signal/modules/event/notifier'
import { dequeue, enqueue } from '@valentin30/signal/runtime/scheduler'

const factory = NotifierFactory(enqueue, dequeue)

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Callback } from '@valentin30/signal/modules/common/types/callback'

export function notifier(source: Source, callback: Callback): Callback {
    return factory(source, callback)
}
