import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  name: string
  src: Unit
}

export type O = {}

export default class Public extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['name', 'src'],
        o: [],
      },
      config
    )
  }
}
