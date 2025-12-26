import { Source } from '@valentin30/signal/core/contracts/source'
import { Callable } from '@valentin30/signal/modules/common/types/callable'
import { Addable } from '@valentin30/signal/modules/common/contracts/addable'

let context: Addable<Source> | null = null

export function register(source: Source): void {
    if (context === null) return
    context.add(source)
}

export function scope<Target extends Addable<Source>, Args extends any[], ReturnType>(
    target: Target | null,
    callback: Callable<Args, ReturnType>,
    ...args: Args
): ReturnType {
    const current = context
    context = target
    try {
        return callback(...args)
    } finally {
        context = current
    }
}

export function track<Target extends Addable<Source>, Args extends any[], ReturnType>(
    target: Target,
    callback: Callable<Args, ReturnType>,
    ...args: Args
): ReturnType {
    return scope(target, callback, ...args)
}

export function untrack<ReturnType, Args extends any[]>(callback: Callable<Args, ReturnType>, ...args: Args): ReturnType {
    return scope(null, callback, ...args)
}
