import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Source } from '@valentin30/signal/core/contracts/source'

export interface NodeSource<T> extends Source {
    read(): T
    write(value: T): boolean
    compare(a: T, b: T): boolean
    link(consumer: Consumer): void
    unlink(consumer: Consumer): void
    version(): number
}
