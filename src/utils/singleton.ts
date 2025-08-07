export function singleton<T>(factory: () => T) {
    function object() {
        return (object.instance ??= factory())
    }

    object.instance = <T | undefined>undefined

    return object
}
