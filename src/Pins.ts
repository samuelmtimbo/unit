import { Pin } from './Pin'

export type Pins<T = any> = {
  [K in keyof T]?: Pin<T[K]>
}
