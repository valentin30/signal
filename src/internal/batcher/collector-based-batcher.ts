import { Batcher } from '@valentin30/signal/core/batch'
import { Collector } from '@valentin30/signal/core/internal/collector'
import { Callable } from '@valentin30/signal/types/callable'
import { Callback } from '@valentin30/signal/types/callback'
import { utils } from '@valentin30/signal/utils'

export class CollectorBasedBatcher implements Batcher {
    private readonly collector: Collector<Callback>

    constructor(collector: Collector<Callback>) {
        this.collector = collector
    }

    public batch<Value>(callback: () => Value): Value
    public batch<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value
    public batch<Value, Args extends any[]>(callback: Callable<Args, Value>, ...args: Args): Value {
        if (this.collector.collecting()) return callback(...args)
        const [value, collected] = this.collector.collect(callback, ...args)
        collected.forEach(utils.call)
        return value
    }
}
