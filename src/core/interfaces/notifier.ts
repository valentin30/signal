import { Subscribable } from '@valentin30/signal/core/interfaces/subscribable'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * `core.interfaces.notifier`
 *
 * Extends {@link Subscribable | `core.interfaces.subscribable`} with manual control over notifications and listener management.
 *
 * @see {@link Callback | `Callback`} for the expected function signature.
 *
 */
export interface Notifier extends Subscribable {
    /**
     * Notifies all registered callbacks.
     */
    notify(): void

    /**
     * Returns a set of all currently registered callbacks.
     *
     * @returns {Set<Callback>} The current set of listeners.
     */
    listeners(): Set<Callback>
}
