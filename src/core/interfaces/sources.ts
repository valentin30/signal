import { Consumer } from '@valentin30/signal/core/contracts/consumer'

export interface Sources<T> {
    compute(): T
    changed(): boolean
    link(consumer: Consumer): void
    unlink(consumer: Consumer): void
}
