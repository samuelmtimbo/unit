import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { stringify } from '../../../../spec/stringify'

export type I = {
  a: any
}

export type O = {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['str'],
      },
      config
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({
      str: stringify(a),
    })
  }
}
