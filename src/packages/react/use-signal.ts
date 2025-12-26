import { Node, signal } from '@valentin30/signal/packages/core/signal'
import { useState } from 'react'

export type { Consumer, Node, Source } from '@valentin30/signal/packages/core/signal'

export function useSignal<T>(initial: T): Node<T> {
    const [result] = useState<Node<T>>(() => signal(initial))
    return result
}
