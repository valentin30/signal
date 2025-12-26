import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'
import { Node } from '@valentin30/signal/modules/node'
import { NodeSource } from '@valentin30/signal/modules/node/source'

export function NodeFactory(register: (source: Source) => void) {
    class N<T> implements Node<T> {
        private readonly source: NodeSource<T>

        constructor(source: NodeSource<T>) {
            this.source = source
        }

        public read(): T {
            register(this.source)
            return this.peek()
        }

        public peek(): T {
            return this.source.read()
        }

        public write(value: T): boolean {
            return this.source.write(value)
        }

        public equals(other: T): boolean {
            return this.compare(this.read(), other)
        }

        public compare(a: T, b: T): boolean {
            return this.source.compare(a, b)
        }

        public link(consumer: Consumer): void {
            return this.source.link(consumer)
        }

        public unlink(consumer: Consumer): void {
            return this.source.unlink(consumer)
        }

        public version(): number {
            return this.source.version()
        }
    }

    return function n<T>(source: NodeSource<T>): Node<T> {
        return new N(source)
    }
}
