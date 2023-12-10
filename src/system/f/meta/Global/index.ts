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

  async get(name: string): Promise<any> {
    return this.__system.global.data.get(name)
  }

  async set(name: string, data: string): Promise<void> {
    return this.__system.global.data.set(name, data)
  }

  async delete(name: string): Promise<any> {
    return this.__system.global.data.delete(name)
  }

  async pathSet(path: string[], name: string, data: any): Promise<void> {
    return this.__system.global.data.pathSet(path, name, data)
  }

  async pathGet(path: string[], name: string): Promise<any> {
    return this.__system.global.data.pathGet(path, name)
  }

  async pathDelete(path: string[], name: string): Promise<void> {
    return this.__system.global.data.pathDelete(path, name)
  }

  async keys(): Promise<string[]> {
    return this.__system.global.data.keys()
  }

  async hasKey(name: string): Promise<boolean> {
    return this.__system.global.data.hasKey(name)
  }
}
