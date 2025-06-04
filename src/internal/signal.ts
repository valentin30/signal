import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Signal, ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Equals } from '@valentin30/signal/core/types/equals'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export function internal_signal<T>(value: T, equals?: Equals<T>): Signal<T> {
    return new internal_signal.Constructor<T>(value, equals, new Set<Callback>(), internal_signal.batcher(), internal_signal.collector())
}

export namespace internal_signal {
    export const batcher = factory<batcher.Factory>('signal.batcher')
    export namespace batcher {
        export type Factory = () => Collector<Callback>
    }

    export const collector = factory<collector.Factory>('signal.collector')
    export namespace collector {
        export type Factory = () => Collector<ReadonlySignal<unknown>>
    }

    export class Constructor<T> implements Signal<T> {
        #value: T

        readonly #equals: Maybe<Equals<T>>

        readonly #listeners: Set<Callback>

        readonly #batcher: Collector<Callback>

        readonly #collector: Collector<ReadonlySignal<unknown>>

        constructor(
            value: T,
            equals: Maybe<Equals<T>>,
            listeners: Set<Callback>,
            batcher: Collector<Callback>,
            collector: Collector<ReadonlySignal<unknown>>,
        ) {
            this.#value = value
            this.#equals = equals
            this.#listeners = listeners
            this.#batcher = batcher
            this.#collector = collector
        }

        public read(): T {
            this.#collector.add(this)
            return this.peek()
        }

        public peek(): T {
            return this.#value
        }

        public write(value: T): void {
            if (this.equals(value)) return
            this.#value = value
            if (this.#batcher.collecting()) this.#listeners.forEach(listener => this.#batcher.add(listener))
            else this.#listeners.forEach(listener => listener())
        }

        public equals(other: T): boolean {
            if (this.#equals) return this.#equals(this.#value, other)
            return this.#value === other
        }

        public subscribe(callback: Callback): Callback {
            this.#listeners.add(callback)
            return this.unsubscribe.bind(this, callback)
        }

        public unsubscribe(callback: Callback): void {
            this.#listeners.delete(callback)
        }
    }
}
