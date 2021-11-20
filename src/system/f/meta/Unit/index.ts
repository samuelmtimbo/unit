import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'

export type I = {}

export type O = {}

export default class _Unit extends Unit {
  constructor(system: System) {
    super({ i: [], o: [] }, {}, system)
  }
}
