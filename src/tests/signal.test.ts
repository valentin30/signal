import { describe, it, expect, vi } from 'vitest'
import { signal } from '@valentin30/signal'

describe('signal', () => {
    it('should return value', () => {
        const v = [1, 2]
        const s = signal(v)
        expect(s.read()).toEqual(v)
    })

    it('should notify subscribers on change', () => {
        const s = signal(1)
        const spy = vi.fn()
        s.subscribe(spy)
        s.write(2)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should read and write values correctly', () => {
        const s = signal(1)
        expect(s.read()).toBe(1)
        expect(s.peek()).toBe(1)
        expect(s.write(2)).toBe(true)
        expect(s.read()).toBe(2)
    })

    it('should return false when writing same value with default comparator', () => {
        const s = signal(1)
        expect(s.write(1)).toBe(false)
    })

    it('should not notify subscribers if value did not change', () => {
        const s = signal(1)
        const spy = vi.fn()
        s.subscribe(spy)
        s.write(1)
        expect(spy).not.toHaveBeenCalled()
    })

    it('should unsubscribe correctly', () => {
        const s = signal(1)
        const spy = vi.fn()
        const unsub = s.subscribe(spy)
        unsub()
        s.write(2)
        expect(spy).not.toHaveBeenCalled()
    })
})
