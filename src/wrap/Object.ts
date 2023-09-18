import { ObjectUpdateType, Object_ } from '../Object'
import { SharedRef } from '../SharefRef'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { J } from '../types/interface/J'

export function wrapSharedRef<T extends Dict<any>>(
  data: SharedRef<T>,
  _system: System
): J<T> {
  const _data = new Object_(data)

  return {
    get<K extends string & keyof T>(name: K): Promise<T[K]> {
      throw new MethodNotImplementedError()
    },
    set<K extends string & keyof T>(name: K, data: T[K]): Promise<void> {
      return _data.pathSet(['current'], name, data)
    },
    delete<K extends string & keyof T>(name: K): Promise<void> {
      throw new MethodNotImplementedError()
    },
    hasKey<K extends string & keyof T>(name: K): Promise<boolean> {
      throw new MethodNotImplementedError()
    },
    keys(): Promise<string[]> {
      throw new MethodNotImplementedError()
    },
    pathGet(path: string[], name: string): Promise<any> {
      throw new MethodNotImplementedError()
    },
    pathSet(path: string[], name: string, data: any): Promise<void> {
      throw new MethodNotImplementedError()
    },
    pathDelete(path: string[], name: string): Promise<void> {
      throw new MethodNotImplementedError()
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
      return _data.subscribe(['current', ...path], key, listener)
    },
  }
}
