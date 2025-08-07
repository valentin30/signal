import { describe, it, expect, vi } from 'vitest'
import { signal, batch } from '@valentin30/signal'

describe('batch', () => {
    it('should batch multiple writes and emit once', () => {
        const a = signal(1)
        const b = signal(2)
        const spy = vi.fn()
        a.subscribe(spy)
        b.subscribe(spy)

        batch(() => {
            a.write(10)
            b.write(20)
            a.write(30)
        })

        expect(spy).toHaveBeenCalledTimes(1)
    })
})
