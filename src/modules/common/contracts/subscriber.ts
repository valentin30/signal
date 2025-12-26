import { Source } from '@valentin30/signal/core/contracts/source'

export interface Subscriber {
    link(source: Source): void
    unlink(source: Source): void
}
