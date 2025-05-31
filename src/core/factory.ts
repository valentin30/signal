import { Arguments } from '@valentin30/signal/core/types/arguments'
import { Function } from '@valentin30/signal/core/types/function'
import { Maybe } from '@valentin30/signal/core/types/maybe'

export type Factory<Fn extends Function> = Fn & {
    factory(factory: Maybe<Fn>): void
    default(factory: Maybe<Fn>): void
    configured(): boolean
}

export function factory<Fn extends Function>(name: string): Factory<Fn> {
    let __default__ = null as Maybe<Fn>
    let __factory__ = null as Maybe<Fn>

    function object(...args: Arguments<Fn>): ReturnType<Fn> {
        if (__factory__) return __factory__(...args)
        if (__default__) return __default__(...args)
        throw new Error(`${name}.factory() not configured!`)
    }

    object.default = (factory: Maybe<Fn>) => (__default__ = factory)
    object.factory = (factory: Maybe<Fn>) => (__factory__ = factory)
    object.configured = () => __default__ !== null || __factory__ !== null

    return object as Factory<Fn>
}
