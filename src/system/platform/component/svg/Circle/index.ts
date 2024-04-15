import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_CIRCLE } from '../../../../_ids'
import { Style } from '../../../Style'

export interface I {
  style: Style
  x: number
  y: number
  r: number
  attr: Dict<string>
}

export interface O {}

export default class SVGCircle extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'x', 'y', 'r', 'attr'],
        o: [],
      },
      {},
      system,
      ID_CIRCLE
    )
  }
}
