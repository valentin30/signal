import { batch } from '@valentin30/signal/core/batch'
import { collector } from '@valentin30/signal/core/collector'
import { composed } from '@valentin30/signal/core/composed'
import { computed } from '@valentin30/signal/core/computed'
import { effect } from '@valentin30/signal/core/effect'
import { ignore } from '@valentin30/signal/core/ignore'
import { shared } from '@valentin30/signal/core/shared'
import { signal } from '@valentin30/signal/core/signal'
import * as internal from '@valentin30/signal/internal'

export * from '@valentin30/signal/core/interfaces/comparable'
export * from '@valentin30/signal/core/interfaces/reader'
export * from '@valentin30/signal/core/interfaces/subscription'
export * from '@valentin30/signal/core/interfaces/writer'

export * from '@valentin30/signal/core/types/arguments'
export * from '@valentin30/signal/core/types/callback'
export * from '@valentin30/signal/core/types/function'
export * from '@valentin30/signal/core/types/maybe'

export * from '@valentin30/signal/core/batch'
export * from '@valentin30/signal/core/collector'
export * from '@valentin30/signal/core/composed'
export * from '@valentin30/signal/core/computed'
export * from '@valentin30/signal/core/effect'
export * from '@valentin30/signal/core/factory'
export * from '@valentin30/signal/core/ignore'
export * from '@valentin30/signal/core/signal'

export * from '@valentin30/signal/core/config'
export * from '@valentin30/signal/core/shared'

export { internal }

internal.signal.collector.default(shared.collector)
internal.computed.collector.default(shared.collector)
internal.composed.collector.default(shared.collector)
internal.effect.collector.default(shared.collector)
internal.ignore.collector.default(shared.collector)

internal.signal.batcher.default(shared.batcher)
internal.composed.batcher.default(shared.batcher)
internal.batch.collector.default(shared.batcher)

collector.default(internal.collector)
signal.default(internal.signal)
computed.default(internal.computed)
composed.default(internal.composed)
effect.default(internal.effect)
batch.default(internal.batch)
ignore.default(internal.ignore)
