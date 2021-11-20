import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { evaluate } from '../../../../spec/evaluate'

type I = {
  str: string
}

type O = {
  a: any
}

export default class Parse extends Functional<I, O> {
  constructor() {
    super({
      i: ['str'],
      o: ['a'],
    })
  }

  f({ str }: I, done: Done<O>): void {
    done({
      a: evaluate(str),
    })
  }
}
