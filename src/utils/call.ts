import { Callback } from '@valentin30/signal/types/callback'

export function call(callback: Callback): void {
    callback()
}
