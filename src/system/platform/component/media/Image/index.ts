import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_IMAGE } from '../../../../_ids'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Image extends Element_<I, O> {
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
}
