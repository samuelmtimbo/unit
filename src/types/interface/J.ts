import { ObjectUpdateType } from '../../ObjectUpdateType'
import { Dict } from '../Dict'
import { Unlisten } from '../Unlisten'

export type J_EE = Dict<any[]>

export interface J<T extends Dict<any> = Dict<any>> {
  get<K extends keyof T>(name: K): T[K]
  set<K extends keyof T>(name: K, data: T[K]): void
  delete<K extends keyof T>(name: K): void
  hasKey(name: string): boolean
  keys(): string[]
  deepGet(path: string[]): any
  deepSet(path: string[], data: any): void
  deepDelete(path: string[]): void
  deepHas(path: string[]): boolean
  subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten
}
