import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_FOREIGN_OBJECT } from '../../../../_ids'

export interface I {}

export interface O {}

export default class ForeignObject extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_FOREIGN_OBJECT
    )
  }
}
