import { Node } from '@valentin30/signal/modules/node'
import { notifier } from '@valentin30/signal/packages/event/notifier'
import { useEffect, useState } from 'react'

export type { Consumer } from '@valentin30/signal/core/contracts/consumer'
export type { Source } from '@valentin30/signal/core/contracts/source'
export type { Node } from '@valentin30/signal/modules/node'

export function useRead<T>(source: Node<T>): T
export function useRead<T>(source: Node<T> | null | undefined): T | null
export function useRead<T>(source: Node<T> | null | undefined): T | null {
    const [value, setValue] = useState<T>(() => {
        if (!source) return null as T
        return source.read()
    })

    useEffect(() => {
        if (!source) return
        return notifier(source, () => setValue(source.read()))
    }, [source])

    return value
}
