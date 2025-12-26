import { Dispatch } from '@valentin30/signal/modules/scheduler/dispatch'

/**
 * A schedulable unit of work that can be executed by the scheduler.
 *
 * Runners are queued and executed during a scheduler flush cycle.
 * The scheduler provides a `dispatch` function that enables controlled,
 * deduplicated execution of callbacks.
 */
export interface Runner {
    /**
     * Execute the runner's work.
     *
     * @param dispatch - A controlled callback executor provided by the scheduler.
     *
     * **Dispatch Behavior:**
     * - Callbacks passed to `dispatch` are deduplicated per flush cycle.
     * - If the same callback reference is dispatched multiple times
     *   (by this runner or any other runner), it executes **only once**
     *   per scheduler flush across the entire application.
     * - This prevents redundant executions when multiple sources
     *   trigger the same callback within a single flush.
     *
     * **When to use dispatch:**
     * - Use `dispatch(callback)` when the callback should be deduplicated
     *   (e.g., Channel subscriptions).
     * - Call callbacks directly when deduplication is not desired
     *   (e.g., Effect computations).
     *
     * @example
     * ```ts
     * // Channel: uses dispatch for deduplication
     * run(dispatch: Dispatch): void {
     *     for (const callback of this.subscribers) {
     *         dispatch(callback) // Same callback runs once per flush
     *     }
     * }
     *
     * // Effect: runs directly, no deduplication
     * run(dispatch: Dispatch): void {
     *     this.cleanup?.()
     *     this.cleanup = this.compute()
     * }
     * ```
     */
    run(dispatch: Dispatch): void
}
