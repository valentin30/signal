import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Disposable } from '@valentin30/signal/modules/common/contracts/disposable'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { Runner } from '@valentin30/signal/modules/scheduler/runner'

export function NotifierFactory(enqueue: (runner: Runner) => void, dequeue: (runner: Runner) => void) {
    class Notifier implements Runner, Consumer, Disposable {
        private source: Source | void

        private callback: Callback | void

        constructor(source: Source, callback: Callback) {
            this.source = source
            this.callback = callback
        }

        public invalidate(): void {
            enqueue(this)
        }

        public run(): void {
            this.callback?.()
        }

        public dispose(): void {
            dequeue(this)
            this.source?.unlink(this)
            this.source = void 0
            this.callback = void 0
        }
    }

    return function notifier(source: Source, callback: Callback): Callback {
        const o = new Notifier(source, callback)
        return () => o.dispose()
    }
}
