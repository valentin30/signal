import { factory } from '@valentin30/signal/core/factory'

export type Effect = () => void
export type EffectCallback = (init: boolean) => EffectCleanup | void
export type EffectCleanup = (destroy: boolean) => void
export type EffectFactoryFunction = (callback: EffectCallback) => Effect
export const effect = factory<EffectFactoryFunction>('effect')
