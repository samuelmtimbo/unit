import { Unit } from '../Class/Unit'
import { Pod } from '../pod'
import { System } from '../system'

export interface UnitClass<T extends Unit = any> {
  new (system: System, pod: Pod): T
}
