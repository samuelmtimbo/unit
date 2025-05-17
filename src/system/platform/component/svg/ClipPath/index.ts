import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_CLIP_PATH } from '../../../../_ids'

export interface I {
  attr: Dict<string>
  id: string
}

export interface O {}

export default class SVGClipPath extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['attr', 'id'],
        o: [],
      },
      {},
      system,
      ID_CLIP_PATH
    )
  }
}
