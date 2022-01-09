import { Unit } from '../../../../Class/Unit'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export type I = {}

export type O = {}

export default class _Unit extends Unit {
  constructor(system: System, pod: Pod) {
    super({ i: [], o: [] }, {}, system, pod)
  }
}
