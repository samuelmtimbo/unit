import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { ID_SESSION_STORAGE } from '../../../../_ids'
import Storage_ from '../Storage_'

export type I = {}

export type O = {}

export default class SessionStorage extends Storage_ {
  constructor(system: System) {
    super(system, ID_SESSION_STORAGE, 'session')
  }

  protected _storage = () => {
    const {
      api: {
        window: { sessionStorage },
      },
    } = this.__system

    if (!sessionStorage) {
      throw new APINotSupportedError('Session Storage')
    }

    return sessionStorage
  }
}
