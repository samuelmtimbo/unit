import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_PATH } from '../../../../_ids'

export interface I {
  style: Dict<string>
  d: string
  fillRule: string
  attr: Dict<string>
}

export interface O {
  d: string
}

export default class SVGPath extends Field<'d', I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'd', 'fillRule', 'attr'],
        o: ['d'],
      },
      {},
      system,
      ID_PATH,
      'd'
    )

    this._defaultState = {
      d: '',
    }
  }
}
