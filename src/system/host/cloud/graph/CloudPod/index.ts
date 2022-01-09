import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { PO } from '../../../../../interface/PO'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  url: string
}

export type O = {
  graph: PO
}

export default class CloudPod extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      },
      system,
      pod
    )
  }

  f({ url }: I, done: Done<O>): void {
    //
  }
}
