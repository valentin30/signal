import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Sources } from '@valentin30/signal/core/interfaces/sources'
import { Disposable } from '@valentin30/signal/modules/common/contracts/disposable'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { Runner } from '@valentin30/signal/modules/scheduler/runner'

export function EffectFactory(enqueue: (runner: Runner) => void, dequeue: (runner: Runner) => void) {
    class Effect implements Runner, Consumer, Disposable {
        private readonly sources: Sources<Callback | void>

        private cleanup: Callback | void

        constructor(sources: Sources<Callback | void>) {
            this.sources = sources
            this.cleanup = void 0
            this.sources.link(this)
            enqueue(this)
        }

        public run(): void {
            try {
                this.cleanup?.()
                this.cleanup = this.sources.compute()
            } catch (error) {
                console.error(error)
            }
        }

        public invalidate(): void {
            enqueue(this)
        }

        public dispose(): void {
            dequeue(this)
            this.sources.unlink(this)
            this.cleanup?.()
            this.cleanup = void 0
        }
    }

    return function effect(sources: Sources<Callback | void>): Callback {
        const o = new Effect(sources)
        return () => o.dispose()
    }
}
