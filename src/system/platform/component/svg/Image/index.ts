import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_IMAGE_2 } from '../../../../_ids'

export interface I {
  style: Dict<string>
  attr: Dict<string>
}

export interface O {}

export default class SVGImage extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr', 'x', 'y', 'width', 'height'],
        o: [],
      },
      {},
      system,
      ID_IMAGE_2
    )
  }
}
