import { Callable } from '@valentin30/signal/modules/common/types/callable'
import { Callback } from '@valentin30/signal/modules/common/types/callback'
import { swap } from '@valentin30/signal/modules/common/utils/swap'
import { Runner } from '@valentin30/signal/modules/scheduler/runner'

let depth = 0
let is_running = false
const lookup = new Set<Callback>()
const runners = {
    current: new Set<Runner>(),
    pending: new Set<Runner>(),
}

let qmt: (callback: Callback) => void
if (typeof queueMicrotask === 'function') qmt = queueMicrotask
else qmt = (callback: Callback) => Promise.resolve().then(callback)

export function schedule(): void {
    if (is_running || depth !== 0) return
    is_running = true
    qmt(flush)
}

export function flush(): void {
    is_running = false

    if (runners.pending.size === 0) return
    swap(runners, 'current', runners, 'pending')
    runners.pending.clear()

    for (const runner of runners.current) runner.run(dispatch)

    lookup.clear()
    runners.current.clear()

    if (runners.pending.size === 0) return
    schedule()
}

export function enqueue(runner: Runner): void {
    if (!runners.pending.has(runner) && !runners.current.has(runner)) {
        runners.pending.add(runner)
    }
    schedule()
}

export function dequeue(runner: Runner): void {
    runners.pending.delete(runner)
    runners.current.delete(runner)
}

function dispatch(callback: Callback): void {
    if (lookup.has(callback)) return
    lookup.add(callback)
    try {
        callback()
    } catch (error) {
        console.error(error)
    }
}

export async function batch<Args extends any[], ReturnType>(
    callback: Callable<Args, Promise<ReturnType>>,
    ...args: Args
): Promise<ReturnType> {
    try {
        depth++
        return await callback(...args)
    } catch (error) {
        throw error
    } finally {
        if (depth > 0) depth--
        schedule()
    }
}
