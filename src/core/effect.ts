import { factory } from '@valentin30/signal/core/factory'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * core/effect.ts
 */
export type Effect = (callback: EffectCallback) => Callback

/**
 * core/effect.ts
 */
export type EffectCallback = (init: boolean) => EffectCleanup | void

/**
 * core/effect.ts
 */
export type EffectCleanup = (destroy: boolean) => void

export const effect = factory<Effect>('effect')
