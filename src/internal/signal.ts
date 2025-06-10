import { Collector } from '@valentin30/signal/core/collector'
import { factory } from '@valentin30/signal/core/factory'
import { Subscribable } from '@valentin30/signal/core/interfaces/subscribable'
import { Value } from '@valentin30/signal/core/interfaces/value'
import { ReadonlySignal, Signal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'
import { Equals } from '@valentin30/signal/core/types/equals'
import { Maybe } from '@valentin30/signal/core/types/maybe'

/**
 * internal/signal.ts
 */
export function internal_signal<T>(value: T, equals?: Equals<T>): Signal<T> {
    return new internal_signal.Constructor<T>(
        new internal_signal.SignalValue(value, equals),
        new internal_signal.SignalNotifier(new Set<Callback>(), internal_signal.batcher()),
        internal_signal.collector(),
    )
}

/**
 * internal/signal.ts
 */
export namespace internal_signal {
    export type BatcherFactory = () => Collector<Callback>
    export type CollectorFactory = () => Collector<ReadonlySignal<unknown>>

    export const batcher = factory<BatcherFactory>('signal.batcher')
    export const collector = factory<CollectorFactory>('signal.collector')

    export class SignalValue<T> implements Value<T> {
        #value: T

        readonly #equals: Maybe<Equals<T>>

        constructor(value: T, equals?: Equals<T>) {
            this.#value = value
            this.#equals = equals
        }

        public read(): T {
            return this.#value
        }

        public write(value: T): boolean {
            if (this.equals(value)) return false
            this.#value = value
            return true
        }

        public equals(other: T): boolean {
            if (this.#equals) return this.#equals(this.#value, other)
            return this.#value === other
        }
    }

    export interface Notifier extends Subscribable {
        notify(): void
        listeners(): Set<Callback>
    }

    export class SignalNotifier implements Notifier {
        readonly #listeners: Set<Callback>
        readonly #batcher: Collector<Callback>

        constructor(listeners: Set<Callback>, batcher: Collector<Callback>) {
            this.#listeners = listeners
            this.#batcher = batcher
        }

        public notify(): void {
            if (this.#batcher.collecting()) this.listeners().forEach(listener => this.#batcher.add(listener))
            else this.listeners().forEach(listener => listener())
        }

        public listeners(): Set<Callback> {
            return this.#listeners
        }

        public subscribe(callback: Callback): Callback {
            this.listeners().add(callback)
            return this.unsubscribe.bind(this, callback)
        }

        public unsubscribe(callback: Callback): void {
            this.listeners().delete(callback)
        }
    }

    export class Constructor<T> implements Signal<T> {
        readonly #value: Value<T>

        readonly #notifier: Notifier

        readonly #collector: Collector<ReadonlySignal<unknown>>

        constructor(value: Value<T>, notifier: Notifier, collector: Collector<ReadonlySignal<unknown>>) {
            this.#value = value
            this.#notifier = notifier
            this.#collector = collector
        }

        public read(): T {
            this.#collector.add(this)
            return this.#value.read()
        }

        public peek(): T {
            return this.#value.read()
        }

        public write(value: T): boolean {
            const success = this.#value.write(value)
            if (!success) return false
            this.#notifier.notify()
            return true
        }

        public equals(other: T): boolean {
            return this.#value.equals(other)
        }

        public subscribe(callback: Callback): Callback {
            return this.#notifier.subscribe(callback)
        }

        public unsubscribe(callback: Callback): void {
            return this.#notifier.unsubscribe(callback)
        }
    }
}
