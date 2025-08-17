import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_TEST } from '../../../_ids'

export interface I<T> {
  str: string
  regex: string
}

export interface O<T> {
  match: boolean
}

export default class Test<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'regex'],
        o: ['match'],
      },
      {},
      system,
      ID_TEST
    )
  }

  f({ str, regex }: Partial<I<T>>, done: Done<O<T>>): void {
    const regex_ = new RegExp(regex)

    const match = regex_.test(str)

    done({ match })
  }
}
