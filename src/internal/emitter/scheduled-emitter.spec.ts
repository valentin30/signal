import { describe, it, expect, vi } from 'vitest'
import { Internal } from '@valentin30/signal'

describe('ScheduledEmitter', () => {
    it('should add callback to listeners on subscribe and remove on unsubscribe', () => {
        const scheduler = { schedule: vi.fn() }
        const emitter = new Internal.ScheduledEmitter(scheduler)

        const cb = vi.fn()
        const unsub = emitter.subscribe(cb)

        emitter.emit()
        expect(scheduler.schedule).toHaveBeenCalledWith(cb)

        unsub()
        emitter.emit()
        expect(scheduler.schedule).toHaveBeenCalledTimes(1)
    })

    it('should call scheduler with all listeners on emit', () => {
        const scheduler = { schedule: vi.fn() }
        const emitter = new Internal.ScheduledEmitter(scheduler)

        const cb1 = vi.fn()
        const cb2 = vi.fn()

        emitter.subscribe(cb1)
        emitter.subscribe(cb2)

        emitter.emit()
        expect(scheduler.schedule).toHaveBeenCalledWith(cb1, cb2)
    })

    it('should not call scheduler if there are no listeners', () => {
        const scheduler = { schedule: vi.fn() }
        const emitter = new Internal.ScheduledEmitter(scheduler)

        emitter.emit()
        expect(scheduler.schedule).not.toHaveBeenCalled()
    })
})
