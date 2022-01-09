import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {}

export interface O {}

export default class SVGLine extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['class', 'style', 'x1', 'x2', 'y1', 'y2'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
