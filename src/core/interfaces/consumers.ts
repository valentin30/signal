import { Consumer } from '@valentin30/signal/core/contracts/consumer'

export interface Consumers {
    active(): boolean
    invalidate(): void
    link(consumer: Consumer): void
    unlink(consumer: Consumer): void
}
