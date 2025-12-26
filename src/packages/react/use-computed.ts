import { computed, Node, Source } from '@valentin30/signal/packages/core/computed'
import { useState } from 'react'

export type { Consumer, Node, Source } from '@valentin30/signal/packages/core/computed'

export function useComputed<T>(compute: () => T, deps?: Source[]): Node<T> {
    const [result] = useState<Node<T>>(() => computed(compute, deps))
    return result
}
