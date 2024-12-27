import { Callback } from '../Callback'

export interface V<T = any> {
  read(callback: Callback<T>): void
  write(data: T, callback: Callback<undefined>): void
}
