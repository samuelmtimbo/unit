import { UCG } from '../types/interface/UCG'
import { GraphSpec, GraphSpecs } from '../types'

export interface Pod {
  specs: GraphSpecs
  graphs: UCG[]

  newSpec(spec: GraphSpec): string
}
