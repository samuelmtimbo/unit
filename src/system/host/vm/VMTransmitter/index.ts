import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  id: string
  stream: Unit
}

export type O = {}

export default class Transmitter extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['id', 'stream'],
        o: [],
      },
      config
    )
  }
}
