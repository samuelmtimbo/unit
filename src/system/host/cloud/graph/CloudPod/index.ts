import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { PO } from '../../../../../interface/PO'

export type I = {
  url: string
}

export type O = {
  graph: PO
}

export default class CloudPod extends Functional<I, O> {
  constructor() {
    super(
      {
        i: ['url'],
        o: ['graph'],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      }
    )
  }

  f({ url }: I, done: Done<O>): void {
    //
  }
}
