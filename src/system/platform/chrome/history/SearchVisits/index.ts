import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { callMethod } from '../../../../../client/extension'
import { Dict } from '../../../../../types/Dict'

export interface I {
  query: Dict<any>
}

export interface O {
  items: Dict<any>[]
}

export default class GetVisits extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['query'],
        o: ['items'],
      },
      config
    )
  }

  f({ query }: I, done: Done<O>) {
    callMethod('history', 'search', query, (items, err) => {
      done({ items }, err)
    })
  }
}
