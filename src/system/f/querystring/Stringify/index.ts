import * as querystring from 'querystring'
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
        i: ['a'],
        o: ['str'],
      },
      {},
      system,
      pod
    )
  }

  f({ obj }: I, done): void {
    // TODO system
    done({ str: querystring.stringify(obj) })
  }
}
