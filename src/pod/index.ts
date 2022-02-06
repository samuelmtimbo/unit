import { UCG } from '../interface/UCG'
import { GraphSpecs } from '../types'

export interface Pod {
  specs: GraphSpecs
  graphs: UCG[]
}
