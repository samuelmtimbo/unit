import { Element } from '../../../../Class/Element/Element'
import { PO } from '../../../../interface/PO'
import { System } from '../../../../system'

export interface I {
  pod: PO
  className: string
  style: object
}

export interface O {}

export default class Render extends Element<I, O> {
  constructor(system: System) {
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
      system
    )
  }
}
