import { Callback } from '../Callback'

export interface R<T = any> {
  read(callback: Callback<T>): void
}
