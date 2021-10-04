import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { J } from '../../../../interface/J'
import { V } from '../../../../interface/V'
import { ObjectUpdateType } from '../../../../Object'
import { Unlisten } from '../../../../Unlisten'

export interface I<T> {
  init: object
}

export interface O<T> {}

export default class Array<T> extends Unit<I<T>, O<T>> implements V, J {
  constructor(config?: Config) {
    super(
      {
        i: ['init'],
        o: ['arr'],
      },
      config,
      {
        output: {
          obj: {
            ref: true,
          },
        },
      }
    )
  }

  get(name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  set(name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPath(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  subscribe(
    path: string[],
    name: any,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new Error('Method not implemented.')
  }

  read(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  write(data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
