import { Computed } from '@valentin30/signal/core/computed'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Node } from '@valentin30/signal/modules/node'
import { consumers } from '@valentin30/signal/packages/builder/consumers'
import { node } from '@valentin30/signal/packages/builder/node'
import { sources } from '@valentin30/signal/packages/builder/sources'
import { value } from '@valentin30/signal/packages/builder/value'

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Node } from '@valentin30/signal/modules/node'

export function computed<T>(compute: () => T, deps?: Source[]): Node<T> {
    return node(new Computed(value(<T>undefined), sources(compute, deps), consumers()))
}
