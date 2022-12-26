import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { ID_UNIT } from '../../../_ids'

export type I = {}

export type O = {}

export default class _Unit extends Unit {
  constructor(system: System) {
    super({ i: [], o: [] }, {}, system, ID_UNIT)
  }
}
