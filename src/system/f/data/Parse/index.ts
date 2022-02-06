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
    const specs = { ...this.__system.specs, ...this.__pod.specs }
    const classes = this.__system.classes
    done({
      a: evaluate(str, specs, classes),
    })
  }
}
