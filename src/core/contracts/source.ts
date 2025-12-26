import { Consumer } from '@valentin30/signal/core/contracts/consumer'

export interface Source {
    link(consumer: Consumer): void
    unlink(consumer: Consumer): void
    version(): number
}
