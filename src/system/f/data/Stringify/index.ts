import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { stringify } from '../../../../spec/stringify'

export type I = {
  a: any
}

export type O = {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['str'],
    })
  }

  f({ a }: I, done: Done<O>): void {
    done({
      str: stringify(a),
    })
  }
}
