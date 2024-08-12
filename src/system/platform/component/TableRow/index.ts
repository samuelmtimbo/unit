import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_TABLE_ROW } from '../../../_ids'

export interface I {
  style: object
  attr: Dict<string>
}

export interface O {}

export default class TableRow extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_TABLE_ROW
    )
  }
}
