import { C } from '../interface/C'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { API } from '../system'
import { GraphSpecs } from '../types'
import { Dict } from '../types/Dict'

export interface Pod {
  specs: GraphSpecs
  units: Dict<U>
  graphs: Dict<U & C & G>
  api: Set<keyof API>
}
