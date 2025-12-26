let tmp: any = null

export function swap<
    Value extends ASource[AKey],
    ASource extends object,
    AKey extends keyof ASource,
    BSource extends Record<BKey, Value>,
    BKey extends keyof BSource,
>(a: ASource, aKey: AKey, b: BSource, bKey: BKey): void {
    if (<Value>a[aKey] === <Value>b[bKey]) return
    tmp = a[aKey]
    a[aKey] = <Value>b[bKey]
    b[bKey] = tmp
    tmp = null
}

export function unsafe_swap(a: object, aKey: string | number | symbol, b: object, bKey: string | number | symbol): void {
    if (a[<never>aKey] === b[<never>bKey]) return
    tmp = a[<never>aKey]
    a[<never>aKey] = b[<never>bKey]
    b[<never>bKey] = <never>tmp
    tmp = null
}
