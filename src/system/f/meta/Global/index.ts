import { Unit } from '../../../../Class/Unit'
import { ObjectUpdateType } from '../../../../Object'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { ID_GLOBAL } from '../../../_ids'
import { keys } from '../../object/Keys/f'

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
    throw new MethodNotImplementedError()
  }

  async get(name: string): Promise<any> {
    return this.__system.global.data[name]
  }

  async set(name: string, data: string): Promise<void> {
    this.__system.global.data[name] = data
  }

  async delete(name: string): Promise<any> {
    delete this.__system.global.data[name]
  }

  async pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new MethodNotImplementedError()
  }

  async pathGet(path: string[], name: string): Promise<any> {
    throw new MethodNotImplementedError()
  }

  async pathDelete(path: string[], name: string): Promise<void> {
    throw new MethodNotImplementedError()
  }

  async keys(): Promise<string[]> {
    return keys(this.__system.global.data)
  }

  async hasKey(name: string): Promise<boolean> {
    const has = this.__system.global.data[name] !== undefined

    return has
  }
}
