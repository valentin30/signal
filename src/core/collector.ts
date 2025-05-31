import { factory } from '@valentin30/signal/core/factory'

export interface Collector<T> {
    add(value: T): void
    collect(callback: () => void): Readonly<Set<T>>
}

export interface CollectorFactoryFunction {
    <T>(): Collector<T>
}

type collector_type = typeof collector
export interface collector extends collector_type {}
export const collector = factory<CollectorFactoryFunction>('collector')
