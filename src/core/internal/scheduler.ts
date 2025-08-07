export interface Scheduler<T> {
    schedule(...value: T[]): void
}
