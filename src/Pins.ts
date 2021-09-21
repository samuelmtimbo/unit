import { Pin } from './Pin'

export type Pins<T> = {
  [name: string]: Pin<T[keyof T]>
}
