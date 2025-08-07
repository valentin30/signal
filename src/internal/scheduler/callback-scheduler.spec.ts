import { describe, it, expect, vi } from 'vitest'
import { Internal } from '@valentin30/signal'

describe('CallbackScheduler', () => {
    it('should not call anything if no callbacks are provided', () => {
        const collector = { collecting: vi.fn(() => true), add: vi.fn() }
        const scheduler = new Internal.CallbackScheduler(collector)

        scheduler.schedule()

        expect(collector.collecting).not.toHaveBeenCalled()
        expect(collector.add).not.toHaveBeenCalled()
    })

    it('should call each callback immediately if not collecting', () => {
        const cb1 = vi.fn()
        const cb2 = vi.fn()
        const collector = { collecting: vi.fn(() => false), add: vi.fn() }
        const scheduler = new Internal.CallbackScheduler(collector)

        scheduler.schedule(cb1, cb2)

        expect(cb1).toHaveBeenCalled()
        expect(cb2).toHaveBeenCalled()
        expect(collector.add).not.toHaveBeenCalled()
    })

    it('should add each callback to collector if collecting', () => {
        const cb1 = vi.fn()
        const cb2 = vi.fn()
        const add = vi.fn()
        const collector = { collecting: vi.fn(() => true), add }
        const scheduler = new Internal.CallbackScheduler(collector)

        scheduler.schedule(cb1, cb2)

        expect(add).toHaveBeenCalledWith(cb1)
        expect(add).toHaveBeenCalledWith(cb2)
        expect(cb1).not.toHaveBeenCalled()
        expect(cb2).not.toHaveBeenCalled()
    })
})
