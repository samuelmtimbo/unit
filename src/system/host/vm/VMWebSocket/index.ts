import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  src: Unit
  handler: string
}

export type O = {}

export default class Websocket extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'handler'],
        o: [],
      },
      config
    )
  }
}
