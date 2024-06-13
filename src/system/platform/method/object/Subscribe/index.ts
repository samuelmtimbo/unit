import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { ObjectUpdateType } from '../../../../../ObjectUpdateType'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { J } from '../../../../../types/interface/J'
import { ID_SUBSCRIBE } from '../../../../_ids'

export interface I<T> {
  obj: J
  path: string[]
  key: string
}

export interface O<T> {
  type: ObjectUpdateType
  path: string[]
  key: string
  data: any
}

export default class Subscribe<T> extends Semifunctional<I<T>, O<T>> {
  private _listener: ((data: any) => void) | undefined
  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['obj', 'path', 'key'],
        fo: [],
        i: ['done'],
        o: ['type', 'path', 'key', 'data'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_SUBSCRIBE
    )
  }

  async f({ obj, path, key }: I<T>, done: Done<O<T>>) {
    try {
      this._unlisten = obj.subscribe(path, key, (type, path_, key_, data) => {
        this._output.type.push(type)
        this._output.key.push(key_)
        this._output.path.push(path_)
        this._output.data.push(data)
      })
    } catch (err) {
      done(undefined, err.message)

      return
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._listener = undefined
      this._unlisten = undefined
    }

    this._forward_all_empty()
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'done') {
    if (this._listener) {
      this.d()

      this._done()
    }
    // }
  }
}
