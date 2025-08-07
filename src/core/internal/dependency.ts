import { Subscribable } from '@valentin30/signal/core/contracts/subscribable'
import { Tracker } from '@valentin30/signal/core/internal/tracker'
import { Callback } from '@valentin30/signal/types/callback'

export interface DependencyState {
    changed(): boolean
}
export interface DependencyObserver extends DependencyState, Tracker<Callback> {}
export interface DependencyTracker extends DependencyObserver, Subscribable {}
