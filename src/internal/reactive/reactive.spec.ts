import { describe, it, expect, vi } from 'vitest'
import { Internal } from '@valentin30/signal'

describe('Reactive', () => {
    it('should call tracker.track and return value from peek on read()', () => {
        const value = { read: vi.fn(() => 42), write: vi.fn(), equals: vi.fn() }
        const tracker = { track: vi.fn() }
        const subscription = { subscribe: vi.fn(), unsubscribe: vi.fn() }

        const signal = new Internal.Reactive(value, tracker, subscription)
        const result = signal.read()

        expect(tracker.track).toHaveBeenCalledWith(signal)
        expect(value.read).toHaveBeenCalled()
        expect(result).toBe(42)
    })

    it('should return value from value.read() on peek()', () => {
        const value = { read: vi.fn(() => 7), write: vi.fn(), equals: vi.fn() }
        const signal = new Internal.Reactive(value, { track: () => {} }, { subscribe: () => () => {}, unsubscribe: () => {} })

        expect(signal.peek()).toBe(7)
        expect(value.read).toHaveBeenCalled()
    })

    it('should delegate write to value.write()', () => {
        const value = { read: () => 0, write: vi.fn(() => true), equals: vi.fn() }
        const signal = new Internal.Reactive(value, { track: () => {} }, { subscribe: () => () => {}, unsubscribe: () => {} })

        expect(signal.write(123)).toBe(true)
        expect(value.write).toHaveBeenCalledWith(123)
    })

    it('should call read() when equals is called with one argument', () => {
        const value = {
            read: vi.fn(() => 10),
            write: () => true,
            equals: vi.fn(() => true),
        }
        const signal = new Internal.Reactive(value, { track: () => {} }, { subscribe: () => () => {}, unsubscribe: () => {} })

        signal.equals(10)

        expect(value.read).toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(10, 10)
    })

    it('should not call read() when equals is called with two arguments', () => {
        const value = {
            read: vi.fn(() => 10),
            write: () => true,
            equals: vi.fn(() => false),
        }
        const signal = new Internal.Reactive(value, { track: () => {} }, { subscribe: () => () => {}, unsubscribe: () => {} })

        signal.equals(1, 2)

        expect(value.read).not.toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(1, 2)
    })

    it('should delegate subscribe and unsubscribe to subscription', () => {
        const callback = vi.fn()
        const unsubscribe = vi.fn()
        const subscription = {
            subscribe: vi.fn(() => unsubscribe),
            unsubscribe: vi.fn(),
        }
        const signal = new Internal.Reactive({ read: () => 0, write: () => true, equals: () => true }, { track: () => {} }, subscription)

        const unsub = signal.subscribe(callback)
        expect(subscription.subscribe).toHaveBeenCalledWith(callback)

        signal.unsubscribe(callback)
        expect(subscription.unsubscribe).toHaveBeenCalledWith(callback)
        expect(unsub).toBe(unsubscribe)
    })
})
