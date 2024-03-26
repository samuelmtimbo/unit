import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { IM } from '../../../../../types/interface/IM'
import { ID_IMAGE } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Image extends Element_<I, O> implements IM {
  constructor(system: System) {
    super(
      {
        i: ['src', 'style'],
        o: [],
      },
      {},
      system,
      ID_IMAGE
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
