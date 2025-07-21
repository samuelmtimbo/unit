import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
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

export default class Subscribe<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['obj', 'path', 'key'],
        fo: [],
        i: [],
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

  async f({ obj, path, key }: I<T>, done: Done<O<T>>, fail: Fail) {
    try {
      this._unlisten = obj.subscribe(path, key, (type, path_, key_, data) => {
        this._output.type.push(type)
        this._output.key.push(key_)
        this._output.path.push(path_)
        this._output.data.push(data)
      })
    } catch (err) {
      fail(err.message)

      return
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
