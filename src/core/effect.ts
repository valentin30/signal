import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

export type Effect = (callback: EffectCallback) => Callback
export type EffectCallback = (init: boolean) => EffectCleanup | void
export type EffectCleanup = (destroy: boolean) => void
export const effect = factory<Effect>('effect')
