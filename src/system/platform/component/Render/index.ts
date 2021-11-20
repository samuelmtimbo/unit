import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { PO } from '../../../../interface/PO'

export interface I {
  pod: PO
  className: string
  style: object
}

export interface O {}

export default class Render extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'pod'],
        o: [],
      },
      config,
      {
        input: {
          pod: {
            ref: true,
          },
        },
      }
    )
  }
}
