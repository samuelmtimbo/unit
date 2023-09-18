import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { ID_STYLE } from '../../../_ids'

export interface I {
  value: string
  attr: object
}

export interface O {}

export default class Style_ extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'attr'],
        o: [],
      },
      {},
      system,
      ID_STYLE
    )
  }
}
