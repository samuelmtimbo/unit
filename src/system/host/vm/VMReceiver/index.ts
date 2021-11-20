import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'

export type I = {
  id: string
}

export type O = {}

export default class Receiver extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['id'],
        o: [],
      },
      config
    )
  }
}
