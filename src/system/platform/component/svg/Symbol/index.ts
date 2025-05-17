import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_SYMBOL } from '../../../../_ids'

export interface I {
  id: string
  style: Dict<string>
  attr: Dict<string>
}

export interface O {}

export default class SVGSymbol extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['id', 'style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_SYMBOL
    )
  }
}
