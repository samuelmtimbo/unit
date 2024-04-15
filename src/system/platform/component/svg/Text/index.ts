import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_TEXT } from '../../../../_ids'

export interface I {
  value: string
  style: Dict<string>
  attr: Dict<string>
  x: number
  y: number
  dx: number
  dy: number
}

export interface O {}

export default class SVGText extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'attr', 'x', 'y', 'dx', 'dy'],
        o: [],
      },
      {},
      system,
      ID_TEXT
    )
  }
}
