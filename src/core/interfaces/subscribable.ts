import { Callback } from '@valentin30/signal/core/types/callback'

export interface Subscribable {
    subscribe(callback: Callback): Callback
    unsubscribe(callback: Callback): void
}
