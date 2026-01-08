import { Callback } from '../Callback'

export interface W<T = any> {
  write(data: T, callback: Callback<undefined>): void
}
