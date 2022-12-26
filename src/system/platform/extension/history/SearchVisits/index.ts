import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callMethod } from '../../../../../client/extension'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_SEARCH_VISITS } from '../../../../_ids'

export interface I {
  query: Dict<any>
}

export interface O {
  items: Dict<any>[]
}

export default class GetVisits extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['query'],
        o: ['items'],
      },
      {},
      system,
      ID_SEARCH_VISITS
    )
  }

  f({ query }: I, done: Done<O>) {
    callMethod('history', 'search', query, (items, err) => {
      done({ items }, err)
    })
  }
}
