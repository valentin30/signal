import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Sources } from '@valentin30/signal/core/interfaces/sources'

function version(source: Source): number {
    return source.version()
}

export function StaticSourcesFactory() {
    class StaticSources<T> implements Sources<T> {
        private readonly sources: Source[]

        private readonly versioning: number[]

        private readonly computation: () => T

        constructor(computation: () => T, sources: Source[]) {
            this.sources = sources
            this.versioning = sources.map(version)
            this.computation = computation
        }

        public link(consumer: Consumer): void {
            for (const source of this.sources) source.link(consumer)
        }

        public unlink(consumer: Consumer): void {
            for (const source of this.sources) source.unlink(consumer)
        }

        public changed(): boolean {
            for (let i = 0; i < this.sources.length; i++) {
                if (this.versioning[i] !== this.sources[i].version()) return true
            }
            return false
        }

        public compute(): T {
            for (let i = 0; i < this.sources.length; i++) {
                this.versioning[i] = this.sources[i].version()
            }
            return this.computation()
        }
    }

    return function static_sources<T>(computation: () => T, sources: Source[]): Sources<T> {
        return new StaticSources(computation, sources)
    }
}
