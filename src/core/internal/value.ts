import { Comparable } from '@valentin30/signal/core/contracts/comparable'
import { Readable } from '@valentin30/signal/core/contracts/readable'
import { Writable } from '@valentin30/signal/core/contracts/writable'

export interface Value<T> extends Readable<T>, Writable<T>, Comparable<T> {}
