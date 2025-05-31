import { Collector } from '@valentin30/signal/core/collector'
import { EffectCallback, EffectCleanup } from '@valentin30/signal/core/effect'
import { factory } from '@valentin30/signal/core/factory'
import { ReadonlySignal } from '@valentin30/signal/core/signal'
import { Callback } from '@valentin30/signal/core/types/callback'

export type EffectCollectorFactoryFunction = () => Collector<ReadonlySignal<unknown>>

export function effect(cb: EffectCallback): Callback {
    let cleanupFn: EffectCleanup | null = null
    let dependencies = effect.collector().collect(() => (cleanupFn = cb(true) ?? null))
    dependencies.forEach(dependency => dependency.subscribe(callback))

    function callback(): void {
        if (cleanupFn) cleanupFn(false)
        const next = effect.collector().collect(() => (cleanupFn = cb(false) ?? null))
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

effect.collector = factory<EffectCollectorFactoryFunction>('effect.collector')
