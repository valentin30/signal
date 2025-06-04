import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Collector } from '@valentin30/signal/core/collector'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { factory } from '@valentin30/signal/core/factory'
import { Equals } from '@valentin30/signal/core/types/equals'

export function internal_computed<T>(compute: () => T, equals?: Equals<T>) {
    return new internal_computed.Constructor<T>(
        true,
        undefined,
        [],
        new Set<ReadonlySignal<unknown>>(),
        new Set<Callback>(),
        internal_computed.collector()!,
        compute,
        equals,
    )
}

export namespace internal_computed {
    export const collector = factory<collector.Factory>('computed.collector')
    export namespace collector {
        export type Factory = () => Collector<ReadonlySignal<unknown>>
    }

    export class Constructor<T> implements ReadonlySignal<T> {
        #empty: boolean

        #value: T | undefined

        #values: [ReadonlySignal<unknown>, unknown][]

        #dependencies: Set<ReadonlySignal<unknown>>

        readonly #compute: () => T

        readonly #equals: Maybe<Equals<T>>

        readonly #listeners: Set<Callback>

        readonly #collector: Collector<ReadonlySignal<unknown>>

        constructor(
            empty: boolean,
            value: T | undefined,
            values: [ReadonlySignal<unknown>, unknown][],
            dependencies: Set<ReadonlySignal<unknown>>,
            listeners: Set<Callback>,
            collector: Collector<ReadonlySignal<unknown>>,
            compute: () => T,
            equals: Maybe<Equals<T>>,
        ) {
            this.#empty = empty
            this.#value = value
            this.#values = values
            this.#dependencies = dependencies
            this.#listeners = listeners
            this.#collector = collector
            this.#compute = compute
            this.#equals = equals
        }

        public read(): T {
            this.#collector.add(this)
            return this.peek()
        }

        public peek(): T {
            if (!this.#empty && !this.#values.some(([dep, value]) => !dep.equals(value))) return this.#value!

            const current = this.#dependencies
            const next = this.#collector.collect(() => (this.#value = this.#compute()))
            this.#dependencies = next
            this.#values = Array.from(next).map(dep => [dep, dep.read()])
            this.#empty = false

            if (!current.size && !next.size) return this.#value!
            if (!this.#listeners.size) return this.#value!

            current.forEach(dep => !next.has(dep) && this.#listeners.forEach(listener => dep.unsubscribe(listener)))
            next.forEach(dep => !current.has(dep) && this.#listeners.forEach(listener => dep.subscribe(listener)))

            return this.#value!
        }

        public equals(other: T): boolean {
            if (this.#equals) return this.#equals(this.read(), other)
            return this.read() === other
        }

        public subscribe(callback: Callback): Callback {
            this.#listeners.add(callback)
            this.#dependencies.forEach(dep => dep.subscribe(callback))
            return this.unsubscribe.bind(this, callback)
        }

        public unsubscribe(callback: Callback): void {
            this.#listeners.delete(callback)
            this.#dependencies.forEach(dep => dep.unsubscribe(callback))
        }
    }
}
