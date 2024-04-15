import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_PATH } from '../../../../_ids'

export interface I {
  style: Dict<string>
  d: string
  fillRule: string
  attr: Dict<string>
}

export interface O {}

export default class SVGPath extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'd', 'fillRule', 'attr'],
        o: [],
      },
      {},
      system,
      ID_PATH
    )

    this._defaultState = {
      d: '',
    }
  }
}
