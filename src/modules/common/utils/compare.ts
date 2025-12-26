export function strict_compare<T>(a: T, b: T): boolean {
    return a === b || (a !== a && b !== b)
}
