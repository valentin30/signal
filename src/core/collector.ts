import { factory } from '@valentin30/signal/core/factory'

export interface Collector<T> {
    add(value: T): void
    collect(callback: () => void): Readonly<Set<T>>
}

export type CollectorFactory = <T>() => Collector<T>
export const collector = factory<CollectorFactory>('collector')
