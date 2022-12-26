import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_MATCH } from '../../../_ids'

export interface I {
  str: string
  regex: string
}

export interface O {
  match: string
}

export default class Match extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'regex'],
        o: ['match'],
      },
      {},
      system,
      ID_MATCH
    )
  }

  f({ str, regex }: I, done): void {
    done({ match: str.match(regex) })
  }
}
