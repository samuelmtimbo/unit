import * as querystring from 'querystring'
import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  str: string
}

export interface O {
  obj: object
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
    done({ obj: querystring.parse(str) })
  }
}
