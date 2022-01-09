import { Graph } from '../Class/Graph'
import { GraphSpec } from './index'
import { UnitClass } from './UnitClass'

export type GraphClass<T extends Graph = any> = UnitClass<T> & {
  __spec?: GraphSpec
}
