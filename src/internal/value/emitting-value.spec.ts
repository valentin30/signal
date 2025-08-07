import { describe, it, expect, vi } from 'vitest'
import { Internal } from '@valentin30/signal'

describe('EmittingValue', () => {
    it('should return the initial value from read()', () => {
        const value = { read: vi.fn(() => 123), write: vi.fn(), equals: vi.fn(() => true) }
        const emitter = { emit: vi.fn() }
        const emitting = new Internal.EmittingValue(value, emitter)

        expect(emitting.read()).toBe(123)
        expect(value.read).toHaveBeenCalled()
    })

    it('should write new value and emit if changed', () => {
        const value = { read: vi.fn(), write: vi.fn(() => true), equals: vi.fn(() => true) }
        const emitter = { emit: vi.fn() }
        const emitting = new Internal.EmittingValue(value, emitter)
        const result = emitting.write(42)

        expect(result).toBe(true)
        expect(value.write).toHaveBeenCalledWith(42)
        expect(emitter.emit).toHaveBeenCalled()
    })

    it('should write new value and not emit if not changed', () => {
        const value = { read: vi.fn(), write: vi.fn(() => false), equals: vi.fn(() => true) }
        const emitter = { emit: vi.fn() }
        const emitting = new Internal.EmittingValue(value, emitter)
        const result = emitting.write(42)

        expect(result).toBe(false)
        expect(value.write).toHaveBeenCalledWith(42)
        expect(emitter.emit).not.toHaveBeenCalled()
    })

    it('should call read() when equals is called with one argument', () => {
        const value = { read: vi.fn(() => 5), write: vi.fn(), equals: vi.fn(() => true) }
        const emitter = { emit: vi.fn() }
        const emitting = new Internal.EmittingValue(value, emitter)

        emitting.equals(5)

        expect(value.read).toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(5, 5)
    })

    it('should not call read() when equals is called with two arguments', () => {
        const value = { read: vi.fn(() => 5), write: vi.fn(), equals: vi.fn(() => false) }
        const emitter = { emit: vi.fn() }
        const emitting = new Internal.EmittingValue(value, emitter)

        emitting.equals(1, 2)

        expect(value.read).not.toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(1, 2)
    })
})
