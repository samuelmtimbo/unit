import { GraphPinsSpec } from '.'
import { GraphMergesSpec } from './GraphMergesSpec'

export type GraphSpecBase = {
  merges?: GraphMergesSpec
  inputs?: GraphPinsSpec
  outputs?: GraphPinsSpec
}
