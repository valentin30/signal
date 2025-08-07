import { describe, it, expect, vi } from 'vitest'
import { Internal } from '@valentin30/signal'

describe('Composed', () => {
    it('should read from value', () => {
        const value = { read: vi.fn(() => 1), peek: () => 1, equals: vi.fn(), subscribe: () => () => {}, unsubscribe: () => {} }
        const writer = { write: vi.fn() }
        const signal = new Internal.Composed(value, writer)

        expect(signal.read()).toBe(1)
        expect(value.read).toHaveBeenCalled()
    })

    it('should peek from value', () => {
        const value = { read: () => 1, peek: vi.fn(() => 2), equals: vi.fn(), subscribe: () => () => {}, unsubscribe: () => {} }
        const writer = { write: vi.fn() }
        const signal = new Internal.Composed(value, writer)

        expect(signal.peek()).toBe(2)
        expect(value.peek).toHaveBeenCalled()
    })

    it('should write and return true if value is different', () => {
        const value = {
            read: () => 1,
            peek: vi.fn(() => 1),
            equals: vi.fn(() => false),
            subscribe: () => () => {},
            unsubscribe: () => {},
        }
        const writer = { write: vi.fn(() => true) }
        const signal = new Internal.Composed(value, writer)

        expect(signal.write(2)).toBe(true)
        expect(value.peek).toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalled()
        expect(writer.write).toHaveBeenCalledWith(2)
    })

    it('should not write and return false if value is equal', () => {
        const value = {
            read: () => 1,
            peek: vi.fn(() => 1),
            equals: vi.fn(() => true),
            subscribe: () => () => {},
            unsubscribe: () => {},
        }
        const writer = { write: vi.fn() }
        const signal = new Internal.Composed(value, writer)

        expect(signal.write(1)).toBe(false)
        expect(value.peek).toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalled()
        expect(writer.write).not.toHaveBeenCalled()
    })

    it('should call equals with one argument using read()', () => {
        const value = {
            read: vi.fn(() => 3),
            peek: () => 3,
            equals: vi.fn(() => true),
            subscribe: () => () => {},
            unsubscribe: () => {},
        }
        const signal = new Internal.Composed(value, { write: () => true })

        signal.equals(3)

        expect(value.read).toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(3, 3)
    })

    it('should call equals with two arguments without read()', () => {
        const value = {
            read: vi.fn(() => 3),
            peek: () => 3,
            equals: vi.fn(() => false),
            subscribe: () => () => {},
            unsubscribe: () => {},
        }
        const signal = new Internal.Composed(value, { write: () => true })

        signal.equals(1, 2)

        expect(value.read).not.toHaveBeenCalled()
        expect(value.equals).toHaveBeenCalledWith(1, 2)
    })

    it('should delegate subscribe and unsubscribe to value', () => {
        const callback = vi.fn()
        const unsubscribe = vi.fn()

        const value = {
            read: () => 0,
            peek: () => 0,
            equals: () => true,
            subscribe: vi.fn(() => unsubscribe),
            unsubscribe: vi.fn(),
        }

        const signal = new Internal.Composed(value, { write: () => true })

        const unsub = signal.subscribe(callback)
        expect(value.subscribe).toHaveBeenCalledWith(callback)
        expect(unsub).toBe(unsubscribe)

        signal.unsubscribe(callback)
        expect(value.unsubscribe).toHaveBeenCalledWith(callback)
    })
})
