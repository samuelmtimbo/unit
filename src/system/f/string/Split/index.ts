import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_SPLIT } from '../../../_ids'
import split from './f'

export interface I {
  a: string
  sep: string
}

export interface O {
  parts: string[]
}

export default class Split extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'sep'],
        o: ['parts'],
      },
      {},
      system,
      ID_SPLIT
    )
  }

  f({ a, sep }: I, done: Done<O>): void {
    done({ parts: split(a, sep) })
  }
}
