import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_FILE_FIELD } from '../../../../_ids'

export interface I {
  style: object
  opt: {
    multiple: boolean
    capture: string
    accept: string
  }
}

export interface O {
  files: any[]
}

export default class FileField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'opt'],
        o: ['files'],
      },
      {},
      system,
      ID_FILE_FIELD
    )

    this._defaultState = {
      value: '',
    }
  }
}
