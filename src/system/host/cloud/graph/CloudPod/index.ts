import { Config } from '../../../../../Class/Unit/Config'
import { PO } from '../../../../../interface/PO'
import { Primitive } from '../../../../../Primitive'

export type I = {
  url: string
}

export type O = {
  pod: PO
}

export default class CloudPod extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['url'],
        o: ['pod'],
      },
      config,
      {
        output: {
          graph: {
            ref: true,
          },
        },
      }
    )
  }
}
