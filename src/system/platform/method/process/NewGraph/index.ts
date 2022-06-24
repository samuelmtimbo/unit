import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Pod } from '../../../../../pod'
import { spawn, start } from '../../../../../spawn'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'

export interface I {
  bundle: BundleSpec
}

export interface O {
  graph: Graph
}

export default class NewGraph extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['bundle'],
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

  f({ bundle }: I, done: Done<O>): void {
    // console.log('NewGraph', 'f', bundle)

    const { spec = {}, specs = {} } = bundle

    const pod = spawn(this.__system, specs)

    const graph = start(this.__system, pod, spec)

    done({ graph })
  }
}
