import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Style } from '../../../Props'

export interface I {
  style: Style
  x: number
  y: number
  r: number
}

export interface O {}

export default class SVGCircle extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'x', 'y', 'r'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
