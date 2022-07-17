import { GraphSpec, GraphSpecs } from '../types'
import { UCG } from '../types/interface/UCG'

export interface Pod {
  specs: GraphSpecs
  graphs: UCG[]

  newSpec(spec: GraphSpec): string
}
