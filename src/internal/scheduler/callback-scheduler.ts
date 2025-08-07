import { CollectorTarget } from '@valentin30/signal/core/internal/collector'
import { Scheduler } from '@valentin30/signal/core/internal/scheduler'
import { Callback } from '@valentin30/signal/types/callback'
import { utils } from '@valentin30/signal/utils'

export class CallbackScheduler implements Scheduler<Callback> {
    private readonly collector: CollectorTarget<Callback>

    constructor(collector: CollectorTarget<Callback>) {
        this.collector = collector
        this.add = this.add.bind(this)
    }

    public schedule(...args: Callback[]): void {
        if (args.length === 0) return
        if (!this.collector.collecting()) return args.forEach(utils.call)
        args.forEach(this.add)
    }

    private add(callback: Callback): void {
        this.collector.add(callback)
    }
}
