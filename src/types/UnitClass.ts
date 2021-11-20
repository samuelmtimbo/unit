import { GraphUnitSpecBase } from '.'
import { U } from '../interface/U'
import { System } from '../system'

export type UnitClass<T extends U = any> = {
  __id?: string
  __unit?: GraphUnitSpecBase

  new (system?: System): T
}
