import { Memory } from '../Class/Unit/Memory'
import { Dict } from './Dict'
import { GraphUnitPinsSpec } from './GraphUnitPinsSpec'
import { GraphUnitSpec } from './GraphUnitSpec'
import { None } from './None'

export type GraphUnitSpecBase = {
  input?: GraphUnitPinsSpec
  output?: GraphUnitPinsSpec
  state?: Dict<any>
  memory?: Memory
  flag?: Dict<any>
  children?: GraphUnitSpec[] | None
  reorder?: string[] | None
}
