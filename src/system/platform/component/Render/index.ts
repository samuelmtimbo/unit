import { Element } from '../../../../Class/Element'
import { P } from '../../../../types/interface/P'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  pod: P
  className: string
  style: object
}

export interface O {}

export default class Render extends Element<I, O> {
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
