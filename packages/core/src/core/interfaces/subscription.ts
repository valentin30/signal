import { Callback } from '@valentin30/signal/core/types/callback'

export interface Subscription {
    subscribe(callback: Callback): Callback
    unsubscribe(callback: Callback): void
}
