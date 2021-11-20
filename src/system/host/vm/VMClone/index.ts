import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  src: Unit
}

export type O = {}

export default class Clone extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src'],
        o: [],
      },
      config
    )
  }
}
