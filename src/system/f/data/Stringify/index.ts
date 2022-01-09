import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'

export type I = {
  a: any
}

export type O = {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['str'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({
      str: stringify(a),
    })
  }
}
