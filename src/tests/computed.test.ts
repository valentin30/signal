import { describe, it, expect, vi } from 'vitest'
import { signal, computed } from '@valentin30/signal'

describe('computed', () => {
    it('should recompute on dependency change', () => {
        const a = signal(1)
        const b = computed(() => a.read() + 1)

        expect(b.read()).toBe(2)
        a.write(2)
        expect(b.read()).toBe(3)
    })

    it('should cache value until dependency changes', () => {
        const a = signal(1)
        const spy = vi.fn(() => a.read() + 1)
        const b = computed(spy)

        expect(b.read()).toBe(2)
        expect(b.read()).toBe(2)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should notify subscribers on dependency change', () => {
        const a = signal(1)
        const b = computed(() => a.read() + 1)
        const spy = vi.fn()
        b.subscribe(spy)
        b.read()
        a.write(2)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should unsubscribe correctly', () => {
        const a = signal(1)
        const b = computed(() => a.read() + 1)
        const spy = vi.fn()
        const unsub = b.subscribe(spy)
        unsub()
        a.write(2)
        expect(spy).not.toHaveBeenCalled()
    })
})
