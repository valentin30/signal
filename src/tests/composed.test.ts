import { describe, it, expect, vi } from 'vitest'
import { signal, composed } from '@valentin30/signal'

describe('composed', () => {
    it('should delegate reads and writes', () => {
        const s = signal(1)
        const c = composed(s, v => s.write(v))

        expect(c.read()).toBe(1)
        c.write(2)
        expect(s.read()).toBe(2)
    })

    it('should not write if value is equal', () => {
        const s = signal(1)
        const spy = vi.fn(v => s.write(v))
        const c = composed(s, spy)
        c.write(1)
        expect(spy).not.toHaveBeenCalled()
    })
})
