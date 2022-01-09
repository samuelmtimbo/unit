import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T
  b: boolean
}

export interface O<T> {
  'a if b': T
}

export default class If0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a if b'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I<T>, done): void {
    // console.log('If', 'f')
    if (b === true) {
      done({ 'a if b': a })
    } else {
      done({ 'a if b': undefined })
    }
  }
}
