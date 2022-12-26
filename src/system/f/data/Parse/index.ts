import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { evaluate } from '../../../../spec/evaluate'
import { System } from '../../../../system'
import { ID_PARSE } from '../../../_ids'

type I = {
  str: string
}

type O = {
  a: any
}

export default class Parse extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str'],
        o: ['a'],
      },
      {},
      system,
      ID_PARSE
    )
  }

  f({ str }: I, done: Done<O>): void {
    const { specs, classes } = this.__system

    done({
      a: evaluate(str, specs, classes),
    })
  }
}
