import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  src: Unit
  on: boolean
}

export type O = {}

export default class CircuitBreaker extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'on'],
        o: [],
      },
      config
    )
  }
}
