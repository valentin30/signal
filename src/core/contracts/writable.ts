export type Write<T> = (value: T) => void | undefined | boolean

export interface Writable<T> {
    write(value: T): boolean
}

export function writer<T>(write: Write<T>): Writable<T> {
    return {
        write(value: T): boolean {
            const result = write(value)
            if (typeof result === 'boolean') return result
            return true
        },
    }
}
