import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IM } from '../../../../../types/interface/IM'
import { ID_IMAGE_0 } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export interface I {
  src: string
  style: object
  attr: Dict<string>
}

export interface O {}

export default class Image extends Element_<I, O> implements IM {
  constructor(system: System) {
    super(
      {
        i: ['src', 'style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_IMAGE_0
    )
  }

  async image(): Promise<any> {
    const localComponent = await firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    )

    return localComponent.$element
  }
}
