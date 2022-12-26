import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_PARENT } from '../../../_ids'

export interface I {}

export interface O {}

export default class Parent extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_PARENT
    )
  }
}
