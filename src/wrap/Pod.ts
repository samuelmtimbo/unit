import { $ } from '../Class/$'
import { Graph } from '../Class/Graph'
import { Pod } from '../pod'
import { System } from '../system'
import { GraphSpecs } from '../types'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { P } from '../types/interface/P'
import { Unlisten } from '../types/Unlisten'

export function wrapPod(pod: Pod, _system: System, _pod: Pod): $ & P {
  return new (class Pod extends $ implements P {
    refUnit(id: string): void {
      throw new Error('Method not implemented.')
    }
    newGraph(bundle: BundleSpec): [Dict<string>, Graph<any, any>, Unlisten] {
      throw new Error('Method not implemented.')
    }
    getSpecs(): GraphSpecs {
      throw new Error('Method not implemented.')
    }
  })(_system, _pod)
}
