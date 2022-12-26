import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_DATUM } from '../../../_ids'

export interface I {
  value: any
  style: object
}

export interface O {}

export default class Datum extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'value'],
        o: [],
      },
      {},
      system,
      ID_DATUM
    )
  }
}
