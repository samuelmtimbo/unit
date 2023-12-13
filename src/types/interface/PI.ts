import { Pin_M } from '../../Pin'

export interface PI<T> {
  take(): T | undefined
  invalidate(): void
  start(): void
  end(): void
  pull(): T | undefined
  pull(): T | undefined
  push(data: T): void
  peak(): T | undefined
  empty(): boolean
  active(): boolean
  ignored(value?: boolean): boolean
  ref(value?: boolean): boolean
  constant(value?: boolean): boolean
  invalid(): boolean
  restore(state: Pin_M<T>): void
}
