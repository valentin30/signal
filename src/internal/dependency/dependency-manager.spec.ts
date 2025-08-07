import { describe, it, expect, vi } from 'vitest'
import { Internal, ReadonlySignal, Callback, Collector } from '@valentin30/signal'

describe('DependencyManager', () => {
    const createSignal = (value: number): ReadonlySignal<number> => {
        return {
            read: () => value,
            peek: () => value,
            equals: (a, b?) => a === b,
            subscribe: vi.fn(),
            unsubscribe: vi.fn(),
        }
    }

    it('should return true from changed if no snapshot exists', () => {
        const collector = { collect: () => [null, new Set<ReadonlySignal<number>>()] } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)
        expect(manager.changed()).toBe(true)
    })

    it('should return true from changed if any snapshot has changed', () => {
        const signal = {
            peek: () => 2,
            equals: (a: unknown, b: unknown) => a === b,
        } as ReadonlySignal<unknown>
        const collector = { collect: () => [null, new Set<ReadonlySignal<number>>()] } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)
        manager['snapshot'] = [[signal, 1]]
        expect(manager.changed()).toBe(true)
    })

    it('should track and skip update if dependencies are equal', () => {
        const signal = createSignal(1)
        const collector = { collect: vi.fn(() => [undefined, new Set([signal])]) } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)
        manager['dependencies'] = new Set([signal])
        const equalsSpy = vi.spyOn(manager as any, 'equals')

        manager.track(() => {})

        expect(collector.collect).toHaveBeenCalled()
        expect(equalsSpy).toHaveBeenCalled()
        expect(manager['dependencies']).toEqual(new Set([signal]))
    })

    it('should update snapshot and dependencies when changed', () => {
        const s1 = createSignal(1)
        const s2 = createSignal(2)
        const oldDep = new Set([s1])
        const newDep = new Set([s1, s2])
        const collector = { collect: vi.fn(() => [undefined, newDep]) } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)
        manager['dependencies'] = oldDep

        manager.track(() => {})

        expect(manager['dependencies']).toEqual(newDep)
        expect(manager['snapshot']?.length).toBe(2)
    })

    it('should subscribe to new and unsubscribe from old dependencies', () => {
        const s1 = createSignal(1)
        const s2 = createSignal(2)
        const cb = vi.fn()
        const oldDep = new Set([s1])
        const newDep = new Set([s2])
        const collector = { collect: vi.fn(() => [undefined, newDep]) } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)
        manager['dependencies'] = oldDep
        manager.subscribe(cb)
        manager.track(() => {})

        expect(s1.unsubscribe).toHaveBeenCalledWith(cb)
        expect(s2.subscribe).toHaveBeenCalledWith(cb)
    })

    it('should add and remove subscribers correctly', () => {
        const s1 = createSignal(1)
        const cb = vi.fn()
        const collector = { collect: () => [null, new Set<ReadonlySignal<number>>()] } as unknown as Collector<ReadonlySignal<unknown>>
        const manager = new Internal.DependencyManager(collector)

        manager['dependencies'] = new Set([s1])
        const unsub = manager.subscribe(cb)

        expect(s1.subscribe).toHaveBeenCalledWith(cb)
        unsub()
        expect(s1.unsubscribe).toHaveBeenCalledWith(cb)
    })
})
