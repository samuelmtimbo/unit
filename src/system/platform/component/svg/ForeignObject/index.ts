import { Style } from 'util'
import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_FOREIGN_OBJECT } from '../../../../_ids'

export interface I {
  style: Style
  attr: Dict<string>
}

export interface O {}

export default class SVGForeignObject extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_FOREIGN_OBJECT
    )
  }
}
