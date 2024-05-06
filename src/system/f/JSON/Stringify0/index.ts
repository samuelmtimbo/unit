import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_STRINGIFY_1 } from '../../../_ids'

export interface I<T> {
  json: T
  space: string | number
}

export interface O {
  string: string
}

export default class Stringify0<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['json', 'space'],
        o: ['string'],
      },
      {
        input: {},
      },
      system,
      ID_STRINGIFY_1
    )
  }

  f({ json, space }: I<T>, done: Done<O>): void {
    let string: string

    try {
      string = JSON.stringify(json, null, space)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ string })
  }
}
