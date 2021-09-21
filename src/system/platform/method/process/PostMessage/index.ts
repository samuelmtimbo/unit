import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export interface I {
  unit: Unit
  message: string
}

export interface O {}

export default class PostMessage extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit', 'message'],
        o: [],
      },
      config,
      {
        input: {
          unit: {
            ref: true,
          },
        },
      }
    )
  }
}
