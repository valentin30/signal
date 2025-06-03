import { Callable } from '@valentin30/signal/core/types/callable'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export type Factory<Fn extends Callable> = Fn & {
    factory(factory: Maybe<Fn>): void
    default(factory: Maybe<Fn>): void
    configured(): boolean
}

export function factory<Fn extends Callable>(name: string): Factory<Fn> {
    let __default__: Fn | null = null
    let __factory__: Fn | null = null

    function object(...args: Parameters<Fn>): ReturnType<Fn> {
        if (__factory__) return __factory__(...args)
        if (__default__) return __default__(...args)
        throw new Error(`${name}.factory() not configured!`)
    }

    object.configured = () => __default__ !== null || __factory__ !== null

    object.default = (factory: Maybe<Fn>): void => {
        __default__ = factory ?? null
    }
    object.factory = (factory: Maybe<Fn>): void => {
        __factory__ = factory ?? null
    }

    return object as Factory<Fn>
}
