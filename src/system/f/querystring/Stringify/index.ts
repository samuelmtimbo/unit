import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_STRINGIFY_2 } from '../../../_ids'

export interface I {
  obj: Dict<any>
}

export interface O {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['obj'],
        o: ['str'],
      },
      {},
      system,
      ID_STRINGIFY_2
    )
  }

  f({ obj }: I, done: Done<O>, fail: Fail): void {
    const {
      api: {
        querystring: { stringify },
      },
    } = this.__system

    let str: string

    try {
      str = stringify(obj)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ str })
  }
}
