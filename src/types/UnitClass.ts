import { Unit } from '../Class/Unit'
import { System } from '../system'

export interface UnitClass<T extends Unit = any> {
  new (system: System, id: string): T
}
