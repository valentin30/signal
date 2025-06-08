import { Callable } from '@valentin30/signal/core/types/callable'
import { Maybe } from '@valentin30/signal/core/types/maybe'

/**
 * @module core.factory
 */

/**
 * Represents a factory function with runtime configuration.
 *
 * When invoked, it will invoke the configured function.
 * If factory function is not configured, it will fallback to a default factory function.
 * If default factory function is not configured, an error will be thrown.
 *
 * @template FactoryFunction The type of the factory function.
 * @memberof core.factory
 */
export type Factory<FactoryFunction extends Callable> = FactoryFunction & {
    /**
     * Sets a factory function to be used.
     * @param factory The override factory function, or `null`/`undefined` to clear it.
     */
    factory(factory: Maybe<FactoryFunction>): void

    /**
     * Sets a default factory function to be used when no override is provided.
     * @param factory The default factory function, or `null`/`undefined` to clear it.
     */
    default(factory: Maybe<FactoryFunction>): void

    /**
     * Checks if a factory function or default factory function is configured.
     * This is useful to determine if the factory can be used without throwing an error.
     * @returns `true` if a factory is available, otherwise `false`.
     */
    configured(): boolean
}

/**
 * Creates a factory function with runtime configuration.
 *
 * When invoked, it will invoke the configured function.
 * If factory function is not configured, it will fallback to a default factory function.
 * If default factory function is not configured, an error will be thrown.
 *
 * @template FactoryFunction The type of the factory function.
 * @param {string} name A label for the factory, used in error messages.
 * @returns {Factory<FactoryFunction>} A callable factory object with `factory`, `default`, and `configured` methods.
 * @memberof core.factory
 */
export function factory<FactoryFunction extends Callable>(name: string): Factory<FactoryFunction> {
    let __default__: FactoryFunction | null = null
    let __factory__: FactoryFunction | null = null

    function object(...args: Parameters<FactoryFunction>): ReturnType<FactoryFunction> {
        if (__factory__) return __factory__(...args)
        if (__default__) return __default__(...args)
        throw new Error(`${name}.factory() not configured!`)
    }

    object.configured = () => __default__ !== null || __factory__ !== null

    object.default = (factory: Maybe<FactoryFunction>): void => {
        __default__ = factory ?? null
    }
    object.factory = (factory: Maybe<FactoryFunction>): void => {
        __factory__ = factory ?? null
    }

    return object as Factory<FactoryFunction>
}
