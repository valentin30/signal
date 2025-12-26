import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Sources } from '@valentin30/signal/core/interfaces/sources'
import { Addable } from '@valentin30/signal/modules/common/contracts/addable'
import { Callable } from '@valentin30/signal/modules/common/types/callable'
import { unsafe_swap } from '@valentin30/signal/modules/common/utils/swap'

type Track = <Target extends Addable<Source>, Args extends any[], ReturnType>(
    target: Target,
    callback: Callable<Args, ReturnType>,
    ...args: Args
) => ReturnType

export function DynamicSourcesFactory(track: Track) {
    class DynamicSources<T> implements Sources<T>, Addable<Source> {
        private current: Map<Source, number>

        private previous: Map<Source, number>

        private consumer: Consumer | null

        private readonly computation: () => T

        constructor(computation: () => T) {
            this.consumer = null
            this.current = new Map<Source, number>()
            this.previous = new Map<Source, number>()
            this.computation = computation
        }

        public link(consumer: Consumer): void {
            if (this.consumer !== null) return
            this.consumer = consumer
            for (const source of this.current.keys()) source.link(consumer)
        }

        public unlink(consumer: Consumer): void {
            if (this.consumer === null || this.consumer !== consumer) return
            this.consumer = null
            for (const source of this.current.keys()) source.unlink(consumer)
        }

        public changed(): boolean {
            for (const [source, version] of this.current) {
                if (source.version() !== version) return true
            }
            return false
        }

        public compute(): T {
            try {
                unsafe_swap(this, 'previous', this, 'current')
                const result = track(this, this.computation)
                if (this.consumer !== null) {
                    for (const source of this.previous.keys()) source.unlink(this.consumer)
                }
                return result
            } finally {
                this.previous.clear()
            }
        }

        public add(source: Source): void {
            this.current.set(source, source.version())
            this.previous.delete(source)
            if (this.consumer !== null) source.link(this.consumer)
        }
    }

    return function dynamic_sources<T>(computation: () => T): Sources<T> {
        return new DynamicSources(computation)
    }
}
