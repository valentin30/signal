import { Internal } from '@valentin30/signal'
import { describe, expect, it } from 'vitest'

describe('CollectorController', () => {
    it('should not collect if not in collecting mode', () => {
        const collector = new Internal.CollectorController<string>()
        collector.add('test')
        collector.track('test')
        expect(collector.collecting()).toBe(false)
    })

    it('should collect values during collect()', () => {
        const collector = new Internal.CollectorController<string>()

        const [result, collected] = collector.collect(() => {
            collector.add('foo')
            collector.track('bar')
            return 42
        })

        expect(result).toBe(42)
        expect(collected).toEqual(new Set(['foo', 'bar']))
        expect(collector.collecting()).toBe(false)
    })

    it('should restore previous collection after collect()', () => {
        const outer: Set<string> = new Set(['existing'])
        const collector = new Internal.CollectorController<string>(outer)

        const [_, innerCollected] = collector.collect(() => {
            collector.add('inner')
        })

        expect(innerCollected).toEqual(new Set(['inner']))
        expect((collector as any).values).toBe(outer)

        // Should add to outer again
        collector.add('after')
        expect(outer.has('after')).toBe(true)
    })

    it('should allow nested collect() calls', () => {
        const collector = new Internal.CollectorController<string>()

        const [outerResult, outerDeps] = collector.collect(() => {
            collector.add('a')

            const [innerResult, innerDeps] = collector.collect(() => {
                collector.add('b')
                return 'inner'
            })

            expect(innerResult).toBe('inner')
            expect(innerDeps).toEqual(new Set(['b']))

            collector.add('c')
            return 'outer'
        })

        expect(outerResult).toBe('outer')
        expect(outerDeps).toEqual(new Set(['a', 'c']))
    })

    it('should disable collection during ignore()', () => {
        const collector = new Internal.CollectorController<string>()

        const [_, collected] = collector.collect(() => {
            collector.add('a')

            const ignored = collector.ignore(() => {
                collector.add('b')
                return 'ignored'
            })

            collector.track('c')
            expect(ignored).toBe('ignored')
        })

        expect(collected).toEqual(new Set(['a', 'c']))
    })
})
