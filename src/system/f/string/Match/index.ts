import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  str: string
  regex: string
}

export interface O {
  match: string
}

export default class Match extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['str', 'regex'],
        o: ['match'],
      },
      config
    )
  }

  f({ str, regex }: I, done): void {
    done({ match: str.match(regex) })
  }
}
