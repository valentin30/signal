export type Equals<T> = (value: T, other: T) => boolean

export interface Comparable<T> {
    equals(other: T): boolean
}
