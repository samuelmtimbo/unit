import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
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
    super(system, ID_LOCAL_STORAGE, 'local')
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
