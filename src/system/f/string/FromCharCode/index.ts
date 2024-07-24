import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_FROM_CHAR_CODE } from '../../../_ids'

export interface I<T> {
  code: number[]
}

export interface O<T> {
  char: string
}

export default class FromCharCode<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['code'],
        o: ['char'],
      },
      {},
      system,
      ID_FROM_CHAR_CODE
    )
  }

  f({ code }: I<T>, done: Done<O<T>>): void {
    const char = String.fromCharCode(...code)

    done({ char })
  }
}
