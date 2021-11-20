import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import split from './f'

export interface I {
  a: string
  sep: string
}

export interface O {
  parts: string[]
}

export default class Split extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'sep'],
      o: ['parts'],
    })
  }

  f({ a, sep }: I, done: Done<O>): void {
    done({ parts: split(a, sep) })
  }
}
