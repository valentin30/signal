export interface Value<T> {
    read(): T
    write(value: T): boolean
    compare(a: T, b: T): boolean
}
