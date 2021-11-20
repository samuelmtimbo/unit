import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'
import { UnitClass } from '../../../../types/UnitClass'

export type I = {
  src: Unit
  class: UnitClass<any>
  opt: {
    strategy?: 'round' | 'cpu'
  }
}

export type O = {}

export default class LoadBalancer extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'opt', 'class'],
        o: [],
      },
      config
    )
  }
}
