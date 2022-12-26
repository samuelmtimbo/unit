import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { P } from '../../../../types/interface/P'
import { ID_RENDER } from '../../../_ids'

export interface I {
  graph: P
  className: string
  style: object
}

export interface O {}

export default class Render extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'graph'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_RENDER
    )
  }
}
