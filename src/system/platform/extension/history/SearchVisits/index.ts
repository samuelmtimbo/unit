import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callMethod } from '../../../../../client/extension'
import { Dict } from '../../../../../types/Dict'

export interface I {
  query: Dict<any>
}

export interface O {
  items: Dict<any>[]
}

export default class GetVisits extends Functional<I, O> {
  constructor() {
    super({
      i: ['query'],
      o: ['items'],
    })
  }

  f({ query }: I, done: Done<O>) {
    callMethod('history', 'search', query, (items, err) => {
      done({ items }, err)
    })
  }
}
