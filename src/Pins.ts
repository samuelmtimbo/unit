import { Pin } from './Pin'
import { Dict } from './types/Dict'

export type Pins<T extends Dict<any> = any> = {
  [K in keyof T]?: Pin<T[K]>
}
