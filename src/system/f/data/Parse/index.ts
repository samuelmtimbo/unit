import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { evaluate } from '../../../../spec/evaluate'

type I = {
  str: string
}

type O = {
  a: any
}

export default class Parse extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['str'],
        o: ['a'],
      },
      config
    )
  }

  f({ str }: I, done: Done<O>): void {
    done({
      a: evaluate(str),
    })
  }
}
