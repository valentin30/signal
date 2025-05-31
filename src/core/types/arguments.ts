export type Arguments<T> = T extends (...args: infer A) => any ? A : never
