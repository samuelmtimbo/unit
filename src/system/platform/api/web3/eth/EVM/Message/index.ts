import { Unit } from '../../../../../../../Class/Unit'
import { Config } from '../../../../../../../Class/Unit/Config'
import { J } from '../../../../../../../interface/J'
import { V } from '../../../../../../../interface/V'
import { ObjectUpdateType } from '../../../../../../../Object'
import { Unlisten } from '../../../../../../../Unlisten'

export interface I<T> {}

export interface O<T> {}

type _Message = {
  value: number
  sender: string
}

export default class Message<T> extends Unit<I<T>, O<T>> implements V, J {
  private _message: _Message = {
    value: 1,
    sender: '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX',
  }

  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config,
      {}
    )
  }

  async get(name: string): Promise<any> {
    switch (name) {
      case 'value':
        return this._message.value
      case 'sender':
        return this._message.sender
      default:
        throw new Error('property not defined')
    }
  }

  set(name: string, data: any): Promise<void> {
    throw new Error('read only')
  }

  delete(name: string): Promise<any> {
    throw new Error('read only')
  }

  hasKey(name: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('read only')
  }

  getPath(path: string[], name: string): Promise<any> {
    if (path.length === 0) {
      return this.get(name)
    } else {
      throw new Error('invalid path')
    }
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('read only')
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
