import { describe, it, expect, vi } from 'vitest'
import { signal, ignore } from '@valentin30/signal'

describe('ignore', () => {
    it('should ignore tracking inside callback', () => {
        const s = signal(1)
        const result = ignore(() => s.read())
        expect(result).toBe(1)
    })
})
