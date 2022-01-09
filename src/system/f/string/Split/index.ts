import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import split from './f'

export interface I {
  a: string
  sep: string
}

export interface O {
  parts: string[]
}

export default class Split extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'sep'],
        o: ['parts'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, sep }: I, done: Done<O>): void {
    done({ parts: split(a, sep) })
  }
}
