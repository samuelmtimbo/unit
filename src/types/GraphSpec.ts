import { GraphComponentSpec, GraphDataSpec, GraphMetadataSpec } from '.'
import { GraphSpecBase } from './GraphSpecBase'
import { GraphUnitsSpec } from './GraphUnitsSpec'

export type GraphSpec = GraphSpecBase & {
  version?: string
  base?: false
  type?: string
  system?: boolean
  units?: GraphUnitsSpec
  name?: string
  metadata?: GraphMetadataSpec
  data?: GraphDataSpec
  render?: boolean
  component?: GraphComponentSpec
  id?: string
}
