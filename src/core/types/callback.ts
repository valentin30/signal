/**
 * Represents a function that takes no arguments and returns nothing.
 */
export type Callback = () => void

/**
 * Represents a function that takes no arguments and returns a Promise that resolves to nothing.
 */
export type AsyncCallback = () => Promise<void>
