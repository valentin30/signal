import { Collector } from '@valentin30/signal/core/collector'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * internal/collector.ts
 */
export function internal_collector<T>(): Collector<T> {
    return new internal_collector.Constructor<T>(null)
}

/**
 * internal/collector.ts
 */
export namespace internal_collector {
    export class Constructor<T> implements Collector<T> {
        #values: Set<T> | null

        constructor(values: Set<T> | null) {
            this.#values = values
        }

        public collecting(): boolean {
            return this.#values !== null
        }

        public add(value: T): void {
            if (!this.collecting() || !this.#values) return
            this.#values.add(value)
        }

        public collect(callback: Callback): Set<T> {
            const current = this.#values
            this.#values = new Set<T>()
            callback()
            const collected = this.#values
            this.#values = current
            return collected
        }

        public ignore(callback: Callback): void {
            const current = this.#values
            this.#values = null
            callback()
            this.#values = current
        }
    }
}
