import { describe, it, expect, vi } from 'vitest'
import { Callback, Collector, Internal } from '@valentin30/signal'

// Fake collector
function createMockCollector() {
    const collecting = vi.fn(() => false)
    const collect = vi.fn((cb: () => unknown) => {
        const value = cb()
        return [value, new Set<Callback>([vi.fn(), vi.fn()])] as const
    })

    return {
        collecting,
        collect,
    } as unknown as Collector<Callback>
}

describe('CollectorBasedBatcher', () => {
    it('should return value from callback', () => {
        const collector = createMockCollector()
        const batcher = new Internal.CollectorBasedBatcher(collector)
        const result = batcher.batch(() => 123)
        expect(result).toBe(123)
    })

    it('should call collect() if not collecting already', () => {
        const collector = createMockCollector()
        const batcher = new Internal.CollectorBasedBatcher(collector)
        batcher.batch(() => 'done')
        expect(collector.collect).toHaveBeenCalled()
    })

    it('should not call collect() if already collecting', () => {
        const collector = createMockCollector()
        collector.collecting = vi.fn(() => true)
        const batcher = new Internal.CollectorBasedBatcher(collector)
        batcher.batch(() => 'done')
        expect(collector.collect).not.toHaveBeenCalled()
    })

    it('should call all collected callbacks after batch', () => {
        const spy1 = vi.fn()
        const spy2 = vi.fn()

        const collector: Collector<Callback> = {
            collecting: () => false,
            collect: (cb: () => unknown) => {
                cb()
                return ['ok', new Set<Callback>([spy1, spy2])] as const
            },
        } as Collector<Callback>

        const batcher = new Internal.CollectorBasedBatcher(collector)
        batcher.batch(() => 'ok')

        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
    })
})
