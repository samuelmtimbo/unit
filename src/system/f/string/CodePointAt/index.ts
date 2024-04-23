import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_CODE_POINT_AT } from '../../../_ids'

export interface I<T> {
  str: string
  at: number
}

export interface O<T> {
  code: number
}

export default class CodePointAt<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'at'],
        o: ['code'],
      },
      {},
      system,
      ID_CODE_POINT_AT
    )
  }

  f({ str, at }: I<T>, done: Done<O<T>>): void {
    const code = str.codePointAt(at)

    done({ code })
  }
}
