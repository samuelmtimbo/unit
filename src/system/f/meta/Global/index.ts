import { Unit } from '../../../../Class/Unit'
import { ObjectUpdateType } from '../../../../ObjectUpdateType'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { ID_GLOBAL } from '../../../_ids'

export type I = {}

export type O = {}

export default class Global extends Unit<I, O> implements J<Dict<any>> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_GLOBAL
    )
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
    return this.__system.global.data.subscribe(path, key, listener)
  }

  get(name: string): any {
    return this.__system.global.data.get(name)
  }

  set(name: string, data: string): void {
    return this.__system.global.data.set(name, data)
  }

  delete(name: string): any {
    return this.__system.global.data.delete(name)
  }

  deepSet(path: string[], data: any): void {
    return this.__system.global.data.deepSet(path, data)
  }

  deepGet(path: string[]): any {
    return this.__system.global.data.deepGet(path)
  }

  deepDelete(path: string[]): void {
    return this.__system.global.data.deepDelete(path)
  }

  deepHas(path: string[]): boolean {
    try {
      this.deepGet(path)

      return true
    } catch (err) {
      return false
    }
  }

  keys(): string[] {
    return this.__system.global.data.keys()
  }

  hasKey(name: string): boolean {
    return this.__system.global.data.hasKey(name)
  }
}
