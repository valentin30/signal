import { Callback } from '@valentin30/signal/types/callback'

export interface Subscribable {
    subscribe(callback: Callback): Callback
    unsubscribe(callback: Callback): void
}
