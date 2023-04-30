import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_PARSE_QUERY } from '../../../_ids'

export interface I {
  str: string
}

export interface O {
  obj: Dict<any>
}

export default class ParseQuery extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str'],
        o: ['obj'],
      },
      {},
      system,
      ID_PARSE_QUERY
    )
  }

  f({ str }: I, done): void {
    const {
      api: {
        querystring: { parse },
      },
    } = this.__system

    let obj: Dict<any>

    try {
      obj = parse(str)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ obj })
  }
}
