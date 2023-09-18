import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_LOCALE_COMPARE } from '../../../_ids'

export interface I {
  a: string
  b: string
}

export interface O {
  'a < b': boolean
}

export default class LocaleCompare extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a < b'],
      },
      {},
      system,
      ID_LOCALE_COMPARE
    )
  }

  f({ a, b }: I, done): void {
    const a_before_b = b.localeCompare(a) === 1

    done({ 'a < b': a_before_b })
  }
}
