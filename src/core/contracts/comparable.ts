export interface Comparator<T> {
    equals(value: T, other: T): boolean
}

export interface Comparable<T> extends Comparator<T> {
    equals(other: T): boolean
    equals(value: T, other: T): boolean
}

export type Equals<T> = (value: T, other: T) => boolean
export namespace Equals {
    export function strict<T>(value: T, other: T): boolean {
        if (value === other) return true
        if (value !== value && other !== other) return true
        return false
    }
}

export function comparator<T>(equals: Equals<T> = Equals.strict): Comparator<T> {
    return { equals }
}
