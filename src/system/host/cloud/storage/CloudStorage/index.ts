import { J } from '../../../../../interface/J'
import { V } from '../../../../../interface/V'
import { ObjectUpdateType } from '../../../../../Object'
import { Pod } from '../../../../../pod'
import { Primitive } from '../../../../../Primitive'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'

export type I = {}

export type O = {}

// TODO

export default class CloudStorage extends Primitive<I, O> implements V, J {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  read(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  write(data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  get<K extends string>(name: K): Promise<any> {
    throw new Error('Method not implemented.')
  }

  set<K extends string>(name: K, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  hasKey<K extends string>(name: K): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  delete<K extends string>(name: K): Promise<void> {
    throw new Error('Method not implemented.')
  }

  keys(): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  pathSet(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  pathGet(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  pathDelete(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }
}
