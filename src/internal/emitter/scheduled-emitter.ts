import { Subscribable } from '@valentin30/signal/core/contracts/subscribable'
import { Emitter } from '@valentin30/signal/core/internal/emitter'
import { Scheduler } from '@valentin30/signal/core/internal/scheduler'
import { Callback } from '@valentin30/signal/types/callback'

export class ScheduledEmitter implements Emitter, Subscribable {
    private readonly listeners: Set<Callback>

    private readonly scheduler: Scheduler<Callback>

    constructor(scheduler: Scheduler<Callback>, listeners: Set<Callback> = new Set<Callback>()) {
        this.scheduler = scheduler
        this.listeners = listeners
    }

    public emit(): void {
        if (this.listeners.size === 0) return
        this.scheduler.schedule(...this.listeners)
    }

    public subscribe(callback: Callback): Callback {
        this.listeners.add(callback)
        return () => this.unsubscribe(callback)
    }

    public unsubscribe(callback: Callback): void {
        this.listeners.delete(callback)
    }
}
