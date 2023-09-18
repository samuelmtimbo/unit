import { GraphUnitMetadataSpec } from '.'
import { GraphUnitSpecBase } from './GraphUnitSpecBase'

export type GraphUnitSpec = GraphUnitSpecBase & {
  id: string
  metadata?: GraphUnitMetadataSpec
}
