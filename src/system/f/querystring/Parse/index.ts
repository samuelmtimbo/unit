import * as querystring from 'querystring'
import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  str: string
}

export interface O {
  obj: object
}

export default class Parse extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['str'],
        o: ['obj'],
      },
      config
    )
  }

  f({ str }: I, done): void {
    done({ obj: querystring.parse(str) })
  }
}
