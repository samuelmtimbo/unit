import * as querystring from 'querystring'
import { Functional } from '../../../../Class/Functional'

export interface I {
  str: string
}

export interface O {
  obj: object
}

export default class Parse extends Functional<I, O> {
  constructor() {
    super({
      i: ['str'],
      o: ['obj'],
    })
  }

  f({ str }: I, done): void {
    done({ obj: querystring.parse(str) })
  }
}
