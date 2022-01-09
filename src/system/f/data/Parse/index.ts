import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { evaluate } from '../../../../spec/evaluate'
import { System } from '../../../../system'

type I = {
  str: string
}

type O = {
  a: any
}

export default class Parse extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['str'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ str }: I, done: Done<O>): void {
    done({
      a: evaluate(str),
    })
  }
}
