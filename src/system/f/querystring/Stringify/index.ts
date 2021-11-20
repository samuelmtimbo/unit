import * as querystring from 'querystring'
import { Functional } from '../../../../Class/Functional'
import { Dict } from '../../../../types/Dict'

export interface I {
  obj: Dict<any>
}

export interface O {
  str: string
}

export default class Stringify extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['str'],
    })
  }

  f({ obj }: I, done): void {
    // TODO system
    done({ str: querystring.stringify(obj) })
  }
}
