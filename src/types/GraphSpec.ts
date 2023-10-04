import { GraphComponentSpec, GraphDataSpec, GraphMetadataSpec } from '.'
import { GraphSpecBase } from './GraphSpecBase'
import { GraphSpecs } from './GraphSpecs'
import { GraphUnitsSpec } from './GraphUnitsSpec'
import { None } from './None'

export type GraphSpec = GraphSpecBase & {
  version?: string
  base?: false
  type?: '`U`&`G`' | '`U`&`G`&`C`'
  private?: boolean
  system?: boolean
  units?: GraphUnitsSpec
  name?: string
  metadata?: GraphMetadataSpec
  data?: GraphDataSpec
  render?: boolean
  component?: GraphComponentSpec
  id?: string
  specs?: GraphSpecs
}
