import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Pod } from '../../../../../pod'
import { spawn, start } from '../../../../../spawn'
import { System } from '../../../../../system'
import { BundleSpec } from '../BundleSpec'

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
    const __pod = spawn(this.__system)

    const graph = start(this.__system, __pod, bundle)

    done({ graph })
  }
}
