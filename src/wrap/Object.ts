import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { Object_ } from '../Object'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { J } from '../types/interface/J'
import { V } from '../types/interface/V'
import { Unlisten } from '../types/Unlisten'

export function wrapSharedRef<T extends Dict<any>>(data: SharedRef<T>): J<T> {
  const _data = new Object_<T>(data.current)

  return {
    get<K extends keyof T>(name: K): T[K] {
      return _data.get(name)
    },

    set<K extends keyof T>(name: K, data: T[K]): void {
      return _data.set(name, data)
    },

    delete<K extends keyof T>(name: K): void {
      return _data.delete(name)
    },

    hasKey(name: string): boolean {
      return _data.hasKey(name)
    },

    keys(): string[] {
      return _data.keys()
    },

    deepGet(path: string[]): any {
      return _data.deepGet(path)
    },

    deepSet(path: string[], data: any): void {
      return _data.deepSet(path, data)
    },

    deepDelete(path: string[]): void {
      return _data.deepDelete(path)
    },

    deepHas(path: string[]) {
      return _data.deepHas(path)
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
      return _data.subscribe(path, key, listener)
    },

    raw() {
      return data
    },
  } as J<T>
}

export function wrapObject<T extends object>(
  data: T,
  system: System
): J<T> & $ {
  const _data = new Object_<T>(data)

  const _obj = new (class Object__ extends $ implements J<T>, V<T> {
    __: string[] = ['V', 'J']

    read(): T {
      return data
    }

    write(data: T): void {
      throw new ReadOnlyError('object')
    }

    get<K extends keyof T>(name: K): T[K] {
      return _data.get(name)
    }

    set<K extends keyof T>(name: K, data: T[K]): void {
      return _data.set(name, data)
    }

    delete<K extends keyof T>(name: K): void {
      return _data.delete(name)
    }

    hasKey(name: string): boolean {
      return _data.hasKey(name)
    }

    keys(): string[] {
      return _data.keys()
    }

    deepGet(path: string[]): any {
      return _data.deepGet(path)
    }

    deepSet(path: string[], data: any): void {
      return _data.deepSet(path, data)
    }

    deepDelete(path: string[]): void {
      return _data.deepDelete(path)
    }

    deepHas(path: string[]): boolean {
      return _data.deepHas(path)
    }

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
      return _data.subscribe(path, key, listener)
    }

    raw() {
      return data
    }
  })(system)

  return _obj
}

export function wrapSharedObjectInterface<T extends object>(
  data: SharedRef<T>,
  system: System
): J<T> & $ {
  return wrapObject(data.current, system)
}
