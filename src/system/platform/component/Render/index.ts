import { Element } from '../../../../Class/Element'
import { PO } from '../../../../interface/PO'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  pod: PO
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
