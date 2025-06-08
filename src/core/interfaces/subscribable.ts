import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * @module core.interfaces.subscribable
 */

/**
 * Describes a contract that allows for subscribing to state changes.
 *
 * @memberof core.interfaces.subscribable
 */
export interface Subscribable {
    /**
     * Registers a callback to be invoked when the state changes.
     *
     * @param callback The callback to invoke on state changes.
     * @returns {Callback} A callback that can be used to unsubscribe.
     */
    subscribe(callback: Callback): Callback

    /**
     * Removes a previously registered callback.
     *
     * @param callback The callback originally passed to `subscribe`.
     * @returns {void}
     */
    unsubscribe(callback: Callback): void
}
