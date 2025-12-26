import { Signal } from '@valentin30/signal/core/signal'
import { consumers } from '@valentin30/signal/packages/builder/consumers'
import { Node, node } from '@valentin30/signal/packages/builder/node'
import { value } from '@valentin30/signal/packages/builder/value'

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Node } from '@valentin30/signal/modules/node'

export function signal<T>(initial: T): Node<T> {
    return node(new Signal(value(initial), consumers()))
}
