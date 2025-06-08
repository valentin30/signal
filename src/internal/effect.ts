import { Collector } from '@valentin30/signal/core/collector'
import { EffectCallback, EffectCleanup } from '@valentin30/signal/core/effect'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'

/**
 * internal/effect.ts
 */
export function internal_effect(cb: EffectCallback): Callback {
    let cleanupFn: EffectCleanup | null = null
    let dependencies = internal_effect.collector().collect(() => (cleanupFn = cb(true) ?? null))
    dependencies.forEach(dependency => dependency.subscribe(callback))

    function callback(): void {
        if (cleanupFn) cleanupFn(false)
        const next = internal_effect.collector().collect(() => (cleanupFn = cb(false) ?? null))
        next.forEach(dependency => !dependencies.has(dependency) && dependency.subscribe(callback))
        dependencies.forEach(dependency => !next.has(dependency) && dependency.unsubscribe(callback))
        dependencies = next
    }

    return () => {
        dependencies.forEach(dependency => dependency.unsubscribe(callback))
        dependencies.clear()
        if (cleanupFn) cleanupFn(true)
        cleanupFn = null
    }
}

/**
 * internal/effect.ts
 */
export namespace internal_effect {
    export type CollectorFactory = () => Collector<ReadonlySignal<unknown>>
    export const collector = factory<CollectorFactory>('effect.collector')
}
