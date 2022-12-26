import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_LINE } from '../../../../_ids'

export interface I {}

export interface O {}

export default class SVGLine extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['class', 'style', 'x1', 'x2', 'y1', 'y2'],
        o: [],
      },
      {},
      system,
      ID_LINE
    )
  }
}
