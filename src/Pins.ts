import { Pin } from './Pin'

export type Pins<T> = {
  [K in keyof T]?: Pin<T[K]>
}
