import { DependencyObserver, Internal, Readable, Value } from '@valentin30/signal'
import { describe, it, expect, vi } from 'vitest'

describe('ComputedValue', () => {
    it('should return cached value without recomputing if dependencies.changed() is false', () => {
        const cache: Value<number> = { read: vi.fn(() => 10), write: vi.fn(), equals: vi.fn(() => true) }
        const computation: Readable<number> = { read: vi.fn(() => 99) }
        const dependencies: DependencyObserver = { changed: vi.fn(() => false), track: vi.fn() }
        const computed = new Internal.ComputedValue(cache, computation, dependencies)
        const result = computed.read()

        expect(result).toBe(10)
        expect(cache.read).toHaveBeenCalled()
        expect(dependencies.changed).toHaveBeenCalled()
        expect(dependencies.track).not.toHaveBeenCalled()
        expect(computation.read).not.toHaveBeenCalled()
        expect(cache.write).not.toHaveBeenCalled()
    })

    it('should recompute and update cache if dependencies.changed() is true', () => {
        const cache: Value<number> = { read: vi.fn(() => 20), write: vi.fn(() => true), equals: vi.fn(() => true) }
        const computation: Readable<number> = { read: vi.fn(() => 42) }
        const dependencies: DependencyObserver = { changed: vi.fn(() => true), track: vi.fn(cb => cb()) }
        const computed = new Internal.ComputedValue(cache, computation, dependencies)
        const result = computed.read()

        expect(result).toBe(20)
        expect(dependencies.changed).toHaveBeenCalled()
        expect(dependencies.track).toHaveBeenCalledWith(expect.any(Function))
        expect(computation.read).toHaveBeenCalled()
        expect(cache.write).toHaveBeenCalledWith(42)
        expect(cache.read).toHaveBeenCalled()
    })

    it('should always return false on write', () => {
        const dummy = new Internal.ComputedValue(
            { read: () => 1, write: () => true, equals: () => true },
            { read: () => 1 },
            { changed: () => false, track: () => {} },
        )
        expect(dummy.write(100)).toBe(false)
    })

    it('should call read() when equals is called with one argument', () => {
        const cache: Value<number> = { read: vi.fn(() => 5), write: vi.fn(), equals: vi.fn(() => true) }
        const dummy = new Internal.ComputedValue(cache, { read: () => 1 }, { changed: () => false, track: () => {} })

        dummy.equals(5)

        expect(cache.read).toHaveBeenCalled()
        expect(cache.equals).toHaveBeenCalledWith(5, 5)
    })

    it('should not call read() when equals is called with two arguments', () => {
        const cache: Value<number> = { read: vi.fn(() => 5), write: vi.fn(), equals: vi.fn(() => false) }
        const dummy = new Internal.ComputedValue(cache, { read: () => 1 }, { changed: () => false, track: () => {} })

        dummy.equals(1, 2)

        expect(cache.read).not.toHaveBeenCalled()
        expect(cache.equals).toHaveBeenCalledWith(1, 2)
    })
})
