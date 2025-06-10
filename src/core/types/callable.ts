/**
 * Represents a generic function type.
 *
 * Can be called with a list of arguments of type `Args`, and returns a value of type `ReturnType`.
 *
 * @template Args The tuple of argument types the function accepts. Defaults to `any[]`.
 * @template ReturnType The type of the value returned by the function. Defaults to `any`.
 */
export type Callable<Args extends any[] = any[], ReturnType = any> = (...args: Args) => ReturnType
