import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'

export interface Node<T> extends Source {
    read(): T
    peek(): T
    write(value: T): boolean
    equals(other: T): boolean
    compare(a: T, b: T): boolean
    link(consumer: Consumer): void
    unlink(consumer: Consumer): void
    version(): number
}
