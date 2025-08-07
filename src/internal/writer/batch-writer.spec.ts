import { Internal, writer } from '@valentin30/signal'
import { describe, expect, it, vi } from 'vitest'

describe('BatchWriter', () => {
    it('should call writer.write through batch', () => {
        const write = vi.fn().mockReturnValue(true)
        const batch = vi.fn(cb => cb())
        const batchWriter = new Internal.BatchWriter(writer(write), { batch })
        const result = batchWriter.write(42)

        expect(batch).toHaveBeenCalledOnce()
        expect(write).toHaveBeenCalledWith(42)
        expect(result).toBe(true)
    })
})
