import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  string: string
}

export interface O {
  json: object
}

export default class Stringify extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['string'],
        o: ['json'],
      },
      config
    )
  }

  f({ string }: I, done: Done<O>): void {
    try {
      const json = JSON.parse(string)
      done({ json })
    } catch (err) {
      done(undefined, 'invalid JSON')
    }
  }
}
