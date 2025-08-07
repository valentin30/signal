import { Callable } from '@valentin30/signal/types/callable'
import { Maybe } from '@valentin30/signal/types/maybe'

export type Factory<FactoryFunction extends Callable> = FactoryFunction & {
    factory(factory: Maybe<FactoryFunction>): void
    default(factory: Maybe<FactoryFunction>): void
    configured(): boolean
}

export function factory<FactoryFunction extends Callable>(name: string): Factory<FactoryFunction> {
    let __default__: FactoryFunction | null = null
    let __factory__: FactoryFunction | null = null

    function object(...args: Parameters<FactoryFunction>): ReturnType<FactoryFunction> {
        if (__factory__) return __factory__(...args)
        if (__default__) return __default__(...args)
        throw new Error(`${name}::factory() not configured!`)
    }

    object.configured = () => __default__ !== null || __factory__ !== null

    object.default = (factory: Maybe<FactoryFunction>): void => {
        __default__ = factory ?? null
    }
    object.factory = (factory: Maybe<FactoryFunction>): void => {
        __factory__ = factory ?? null
    }

    return <Factory<FactoryFunction>>object
}
