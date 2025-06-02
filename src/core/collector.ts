import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

export interface Collector<T> {
    add(value: T): void
    collecting(): boolean
    collect(callback: Callback): Readonly<Set<T>>
    ignore(callback: Callback): void
}

export type CollectorFactory = <T>() => Collector<T>
export const collector = factory<CollectorFactory>('collector')
