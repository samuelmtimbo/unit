import { ObjectUpdateType } from '../Object'
import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { J } from '../types/interface/J'

export function wrapObject<T extends Dict<any>>(
  data: SharedRef<T>,
  _system: System
): J<T> {
  return {
    get<K extends string & keyof T>(name: K): Promise<T[K]> {
      throw new Error('Method not implemented.')
    },
    set<K extends string & keyof T>(name: K, data: T[K]): Promise<void> {
      throw new Error('Method not implemented.')
    },
    delete<K extends string & keyof T>(name: K): Promise<void> {
      throw new Error('Method not implemented.')
    },
    hasKey<K extends string & keyof T>(name: K): Promise<boolean> {
      throw new Error('Method not implemented.')
    },
    keys(): Promise<string[]> {
      throw new Error('Method not implemented.')
    },
    pathGet(path: string[], name: string): Promise<any> {
      throw new Error('Method not implemented.')
    },
    pathSet(path: string[], name: string, data: any): Promise<void> {
      throw new Error('Method not implemented.')
    },
    pathDelete(path: string[], name: string): Promise<void> {
      throw new Error('Method not implemented.')
    },
    subscribe(
      path: string[],
      key: string,
      listener: (
        type: ObjectUpdateType,
        path: string[],
        key: string,
        data: any
      ) => void
    ): Unlisten {
      throw new Error('Method not implemented.')
    },
  }
}
