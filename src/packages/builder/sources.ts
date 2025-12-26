import { Source } from '@valentin30/signal/core/contracts/source'
import { Sources } from '@valentin30/signal/core/interfaces/sources'

import { DynamicSourcesFactory } from '@valentin30/signal/modules/sources/dynamic'
import { StaticSourcesFactory } from '@valentin30/signal/modules/sources/static'
import { track } from '@valentin30/signal/runtime/context'

const static_sources = StaticSourcesFactory()
const dynamic_sources = DynamicSourcesFactory(track)

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Sources } from '@valentin30/signal/core/interfaces/sources'

export function sources<T>(compute: () => T, dependencies?: Source[]): Sources<T> {
    if (dependencies) return static_sources(compute, dependencies)
    return dynamic_sources(compute)
}
