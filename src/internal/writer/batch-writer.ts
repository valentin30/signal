import { Batcher } from '@valentin30/signal/core/batch'
import { Writable } from '@valentin30/signal/core/contracts/writable'

export class BatchWriter<T> implements Writable<T> {
    private readonly writer: Writable<T>

    private readonly batcher: Batcher

    constructor(writer: Writable<T>, batcher: Batcher) {
        this.writer = writer
        this.batcher = batcher
    }

    public write(value: T): boolean {
        return this.batcher.batch(() => this.writer.write(value))
    }
}
