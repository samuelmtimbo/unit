import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { C } from '../../../../interface/C'

export interface I {
  parent: C
  at: number
}

export interface O {}

export default class RemoveChild extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['parent', 'at'],
        o: [],
      },
      config,
      {
        input: {
          parent: {
            ref: true,
          },
        },
      }
    )
  }

  f({ parent, at }: I, done: Done<O>): void {
    try {
      parent.removeChild(at)
      done({})
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
