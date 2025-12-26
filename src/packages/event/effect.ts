import { Source } from '@valentin30/signal/core/contracts/source'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { EffectFactory } from '@valentin30/signal/modules/event/effect'
import { sources } from '@valentin30/signal/packages/builder/sources'
import { dequeue, enqueue } from '@valentin30/signal/runtime/scheduler'

const factory = EffectFactory(enqueue, dequeue)

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Callback } from '@valentin30/signal/modules/common/types/callback'

export function effect(callback: () => Callback | void, dependencies?: Source[]): Callback {
    return factory(sources(callback, dependencies))
}
