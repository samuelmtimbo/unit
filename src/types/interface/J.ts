import { ObjectUpdateType } from '../../ObjectUpdateType'
import { Dict } from '../Dict'
import { Unlisten } from '../Unlisten'

export type J_EE = Dict<any[]>

export interface J<T extends Dict<any> = Dict<any>> {
  get<K extends keyof T>(name: K): Promise<T[K]>
  set<K extends keyof T>(name: K, data: T[K]): Promise<void>
  delete<K extends keyof T>(name: K): Promise<void>
  hasKey(name: string): Promise<boolean>
  keys(): Promise<string[]>
  deepGet(path: string[]): Promise<any>
  deepSet(path: string[], data: any): Promise<void>
  deepDelete(path: string[]): Promise<void>
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
