import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
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

  f({ str }: I, done: Done<O>, fail: Fail): void {
    const {
      api: {
        querystring: { parse },
      },
    } = this.__system

    let obj: Dict<any>

    try {
      obj = parse(str)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ obj })
  }
}
