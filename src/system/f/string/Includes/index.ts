import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_INCLUDES_1 } from '../../../_ids'

export interface I<T> {
  str: string
  search: string
}

export interface O<T> {
  test: boolean
}

export default class Includes<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'search'],
        o: ['test'],
      },
      {},
      system,
      ID_INCLUDES_1
    )
  }

  f({ str, search }: Partial<I<T>>, done): void {
    const test = str.includes(search)

    done({ test })
  }
}
