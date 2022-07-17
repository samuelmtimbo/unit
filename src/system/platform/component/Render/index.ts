import { Element_ } from '../../../../Class/Element'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { P } from '../../../../types/interface/P'

export interface I {
  pod: P
  className: string
  style: object
}

export interface O {}

export default class Render extends Element_<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'pod'],
        o: [],
      },
      {
        input: {
          pod: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }
}
