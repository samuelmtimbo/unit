import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Style } from '../../../Props'

export interface I {
  style: Style
  x: number
  y: number
  width: number
  height: number
}

export interface O {}

export default class SVGRect extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'x', 'y', 'width', 'height'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
