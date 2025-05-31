import { Collector } from '@valentin30/signal/core/collector'
import { Equals } from '@valentin30/signal/core/interfaces/comparable'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { Computed } from '@valentin30/signal/internal/computed'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export function composed<T>(compute: () => T, write: (value: T) => void, equals?: Equals<T>) {
    if (!composed.collector()) {
        throw new Error('composed: collector is not configured.')
    }
    return new Composed<T>(
        true,
        undefined,
        [],
        new Set<ReadonlySignal<unknown>>(),
        new Set<Callback>(),
        composed.collector()!,
        compute,
        write,
        equals,
    )
}
composed.collector = factory<ComposedCollectorFactoryFunction>('composed.collector')

export interface ComposedCollectorFactoryFunction {
    (): Maybe<Collector<ReadonlySignal<unknown>>>
}

export class Composed<T> extends Computed<T> implements Signal<T> {
    private readonly writeFn: (value: T) => void

    constructor(
        empty: boolean,
        value: T | undefined,
        values: unknown[],
        dependencies: Set<ReadonlySignal<unknown>>,
        listeners: Set<Callback>,
        collector: Collector<ReadonlySignal<unknown>>,
        compute: () => T,
        write: (value: T) => void,
        equals: Maybe<Equals<T>>,
    ) {
        super(empty, value, values, dependencies, listeners, collector, compute, equals)
        this.writeFn = write
    }

    public write(value: T): void {
        if (this.equals(value)) return
        this.writeFn(value)
    }
}
