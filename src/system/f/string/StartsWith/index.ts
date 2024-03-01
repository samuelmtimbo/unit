import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_STARTS_WITH } from '../../../_ids'

export interface I {
  str: string
  search: string
  position: number
}

export interface O {
  test: boolean
}

export default class StartsWith extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'search', 'position'],
        o: ['test'],
      },
      {},
      system,
      ID_STARTS_WITH
    )
  }

  f({ str, search, position }: I, done: Done<O>): void {
    const test = str.startsWith(search, position)

    done({ test })
  }
}
