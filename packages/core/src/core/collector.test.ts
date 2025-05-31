import { Collector, collector, CollectorFactoryFunction } from '@valentin30/signal/core/collector'
import { Maybe } from '@valentin30/signal/core/types/maybe'
import { expect, test } from 'vitest'

export function collector_prepare(__default__: Maybe<CollectorFactoryFunction>, __factory__: Maybe<CollectorFactoryFunction>) {
    collector.default(__default__)
    collector.factory(__factory__)
}

export function collector_cleanup() {
    collector.default(null)
    collector.factory(null)
}

export function test_collected_values<T>(expected: Readonly<Set<T>>, collected: Readonly<Set<T>>) {
    expect(collected).toBeInstanceOf(Set)
    expect(collected.size).toBe(expected.size)
    expected.forEach(value => {
        expect(collected.has(value)).toBe(true)
    })
}

export function test_collector_implementation(factory: CollectorFactoryFunction) {
    test('collector with "factory" must return "factory" result', () => {
        // Prepare
        const instance = factory<any>()
        collector_prepare(null, () => instance)

        // Test
        expect(collector()).toBe(instance)

        // Cleanup
        collector_cleanup()
    })

    test('collector with "default" must return "default" result', () => {
        // Prepare
        const instance = factory<any>()
        collector_prepare(() => instance, null)

        // Test
        expect(collector()).toBe(instance)

        // Cleanup
        collector_cleanup()
    })

    test('collector with "default" and "factory" must return "factory" result', () => {
        // Prepare
        const instance = factory<any>()
        collector_prepare(
            () => {
                throw new Error('This should not be called')
            },
            () => instance,
        )

        // Test
        expect(collector()).toBe(instance)

        // Cleanup
        collector_cleanup()
    })

    test('collector.collect must return all added values', () => {
        // Prepare
        collector_prepare(null, factory)

        // Test
        const instance = collector()

        // Should be ignored
        instance.add(1)

        test_collected_values(
            new Set([3, 4]),
            instance.collect(() => {
                test_collected_values(
                    new Set([2]),
                    instance.collect(() => instance.add(2)),
                )

                instance.add(3)
                instance.add(4)
            }),
        )

        // Cleanup
        collector_cleanup()
    })
}

test('collector without "factory" and "default" must throw error', () => {
    // Prepare
    collector_prepare(null, null)

    // Test
    expect(collector).toThrowError()

    // Cleanup
    collector_cleanup()
})
