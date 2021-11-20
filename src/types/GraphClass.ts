import { G } from '../interface/G'
import { UnitClass } from './UnitClass'
import { GraphSpec } from './index'

export type GraphClass<T extends G = any> = UnitClass<T> & {
  __spec?: GraphSpec
}
