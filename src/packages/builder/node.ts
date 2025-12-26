import { Node } from '@valentin30/signal/modules/node'
import { NodeFactory } from '@valentin30/signal/modules/node/factory'
import { NodeSource } from '@valentin30/signal/modules/node/source'
import { register } from '@valentin30/signal/runtime/context'

const factory = NodeFactory(register)

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Value } from '@valentin30/signal/core/interfaces/value'
export type { Node } from '@valentin30/signal/modules/node'
export type { NodeSource } from '@valentin30/signal/modules/node/source'

export function node<T>(source: NodeSource<T>): Node<T> {
    return factory(source)
}
