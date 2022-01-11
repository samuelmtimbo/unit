import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface I {
  obj: Dict<any>
}

export interface O {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['obj'],
        o: ['str'],
      },
      {},
      system,
      pod
    )
  }

  f({ obj }: I, done): void {
    const {
      api: {
        querystring: { stringify },
      },
    } = this.__system

    let str: string

    try {
      str = stringify(obj)
    } catch (err) {
      done(undefined, err.message)
      return
    }

    done({ str })
  }
}
