import { ObjectUpdateType } from '../../../../../ObjectUpdateType'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { ObjectPathTooDeepError } from '../../../../../exception/ObjectPathTooDeep'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { J } from '../../../../../types/interface/J'
import { V } from '../../../../../types/interface/V'
import { ID_LOCAL_STORAGE } from '../../../../_ids'
import Storage_ from '../Storage_'

export type I = {}

export type O = {}

export default class _LocalStorage
  extends Storage_
  implements J<Dict<any>>, V<Dict<string>>
{
  constructor(system: System) {
    super(system, ID_LOCAL_STORAGE)
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
    const { emitter } = this.__system

    if (path.length > 0) {
      throw new ObjectPathTooDeepError()
    }

    const setListener = (key_: string, data: string) => {
      if (key === '*' || key_ === key) {
        listener('set', path, key_, data)
      }
    }

    const deleteListener = (key_: string, data: string) => {
      if (key === '*' || key_ === key) {
        listener('delete', path, key, data)
      }
    }

    emitter.addListener('set', setListener)
    emitter.addListener('delete', deleteListener)

    const unlisten = () => {
      emitter.removeListener('set', setListener)
      emitter.removeListener('delete', deleteListener)
    }

    return unlisten
  }

  protected _storage = () => {
    const {
      api: {
        window: { localStorage },
      },
    } = this.__system

    if (!localStorage) {
      throw new APINotSupportedError('Local Storage')
    }

    return localStorage
  }
}
