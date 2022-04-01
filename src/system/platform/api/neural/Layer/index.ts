import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../method/process/BundleSpec'

export interface I {
  W: any
  N: BundleSpec
  L: any
  n: number
}

export interface O {}

export default class Layer extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['W', 'N', 'L', 'n'],
        o: [],
      },
      {
        input: {
          W: {
            ref: true,
          },
          N: {},
          L: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      pod
    )
  }

  async f({}: I, done: Done<O>): Promise<void> {
    
    done({})
  }
}
