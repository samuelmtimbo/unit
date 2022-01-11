import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface I {
  str: string
}

export interface O {
  obj: Dict<any>
}

export default class Parse extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['str'],
        o: ['obj'],
      },
      {},
      system,
      pod
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
