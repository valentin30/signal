export interface Readable<T> {
    read(): T
}

export function reader<T>(read: () => T): Readable<T> {
    return { read }
}
