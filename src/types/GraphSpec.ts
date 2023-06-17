import { Dict } from './Dict'
import { None } from './None'
import {
  GraphSpecBase,
  GraphUnitsSpec,
  GraphMetadataSpec,
  GraphDataSpec,
  GraphComponentSpec,
  GraphSpecs,
} from '.'

export type GraphSpec = GraphSpecBase & {
  base?: false
  type?: '`U`&`G`' | '`U`&`G`&`C`'
  method?: boolean
  private?: boolean
  system?: boolean
  fork?: boolean
  units?: GraphUnitsSpec
  name?: string
  metadata?: GraphMetadataSpec
  data?: GraphDataSpec
  render?: boolean
  component?: GraphComponentSpec
  methods?: Dict<GraphSpec>
  self?: string | None
  id?: string
  specs?: GraphSpecs
}
