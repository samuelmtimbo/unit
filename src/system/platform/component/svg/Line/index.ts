import { Style } from 'util'
import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_LINE } from '../../../../_ids'

export interface I {
  x1: number
  y1: number
  x2: number
  y2: number
  style: Style
  attr: Dict<string>
}

export interface O {}

export default class SVGLine extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'x1', 'x2', 'y1', 'y2', 'attr'],
        o: [],
      },
      {},
      system,
      ID_LINE
    )
  }
}
