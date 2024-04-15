import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_TEXT_PATH } from '../../../../_ids'

export interface I {
  style: Dict<string>
  attr: Dict<string>
}

export interface O {}

export default class SVGTextPath extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_TEXT_PATH
    )
  }
}
