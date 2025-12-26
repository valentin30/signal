import { Value } from '@valentin30/signal/core/interfaces/value'

export function ValueFactory(compare: <T>(a: T, b: T) => boolean) {
    class V<T> implements Value<T> {
        private value: T

        constructor(value: T) {
            this.value = value
        }

        public read(): T {
            return this.value
        }

        public write(value: T): boolean {
            if (this.compare(this.read(), value)) return false
            this.value = value
            return true
        }

        public compare(a: T, b: T): boolean {
            return compare(a, b)
        }
    }

    return function v<T>(value: T): Value<T> {
        return new V(value)
    }
}
