import { describe, it, expect, vi } from 'vitest'
import { Comparator, Internal } from '@valentin30/signal'

describe('BasicValue', () => {
    it('should initialize with default value', () => {
        const value = new Internal.BasicValue<number>(42, { equals: (a, b) => a === b })
        expect(value.read()).toBe(42)
    })

    it('should update internal value when comparator returns false', () => {
        const comparator: Comparator<number> = { equals: vi.fn(() => false) }
        const value = new Internal.BasicValue<number>(10, comparator)
        const result = value.write(20)

        expect(result).toBe(true)
        expect(value.read()).toBe(20)
        expect(comparator.equals).toHaveBeenCalledWith(10, 20)
    })

    it('should not update value when comparator returns true', () => {
        const comparator: Comparator<number> = { equals: vi.fn(() => true) }
        const value = new Internal.BasicValue<number>(10, comparator)
        const result = value.write(10)

        expect(result).toBe(false)
        expect(value.read()).toBe(10)
        expect(comparator.equals).toHaveBeenCalledWith(10, 10)
    })

    it('should call read() when equals is called with one argument', () => {
        const comparator: Comparator<number> = { equals: vi.fn(() => true) }
        const value = new Internal.BasicValue<number>(5, comparator)
        const result = value.equals(5)

        expect(result).toBe(true)
        expect(comparator.equals).toHaveBeenCalledWith(5, 5)
    })

    it('should not call read() when equals is called with two arguments', () => {
        const comparator: Comparator<number> = { equals: vi.fn(() => false) }
        const value = new Internal.BasicValue<number>(123, comparator)
        const result = value.equals(1, 2)

        expect(result).toBe(false)
        expect(comparator.equals).toHaveBeenCalledWith(1, 2)
    })
})
