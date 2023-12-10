import { ObjectUpdateType } from '../../ObjectUpdateType'
import { Dict } from '../Dict'
import { Unlisten } from '../Unlisten'

export type J_EE = Dict<any[]>

export interface J<T extends Dict<any> = any> {
  get<K extends string & keyof T>(name: K): Promise<T[K]>
  set<K extends string & keyof T>(name: K, data: T[K]): Promise<void>
  delete<K extends string & keyof T>(name: K): Promise<void>
  hasKey<K extends string & keyof T>(name: K): Promise<boolean>
  keys(): Promise<string[]>
  pathGet(path: string[], name: string): Promise<any>
  pathSet(path: string[], name: string, data: any): Promise<void>
  pathDelete(path: string[], name: string): Promise<void>
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
