import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Disposable } from '@valentin30/signal/modules/common/contracts/disposable'
import { Subscriber } from '@valentin30/signal/modules/common/contracts/subscriber'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { Dispatch } from '@valentin30/signal/modules/scheduler/dispatch'
import { Runner } from '@valentin30/signal/modules/scheduler/runner'

export interface Channel extends Subscriber, Disposable {
    subscribe(callback: Callback): void
    unsubscribe(callback: Callback): void
}

export function ChannelFactory(enqueue: (runner: Runner) => void, dequeue: (runner: Runner) => void) {
    class Ch implements Channel, Runner, Consumer {
        private queued: boolean

        private current: Set<Callback>

        private pending: Set<Callback>

        private sources: Set<Source>

        constructor() {
            this.queued = false
            this.pending = new Set()
            this.current = new Set()
            this.sources = new Set()
        }

        public run(dispatch: Dispatch): void {
            for (const callback of this.current) dispatch(callback)
            this.cleanup()
        }

        private cleanup(): void {
            this.queued = false
            if (this.pending.size === 0) return
            for (const callback of this.pending) this.current.add(callback)
            this.pending.clear()
        }

        public subscribe(callback: Callback): void {
            if (this.queued) this.pending.add(callback)
            else this.current.add(callback)
        }

        public unsubscribe(callback: Callback): void {
            this.current.delete(callback)
            this.pending.delete(callback)
        }

        public link(source: Source): void {
            source.link(this)
            this.sources.add(source)
        }

        public unlink(source: Source): void {
            source.unlink(this)
            this.sources.delete(source)
        }

        public dispose(): void {
            dequeue(this)
            this.cleanup()
            for (const source of this.sources) source.unlink(this)
            this.current.clear()
            this.sources.clear()
        }

        public invalidate(): void {
            enqueue(this)
            this.queued = true
        }
    }

    return function ch(...sources: Source[]): Channel {
        const channel = new Ch()
        for (const source of sources) channel.link(source)
        return channel
    }
}
