import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  json: T
}

export interface O {
  string: string
}

export default class Stringify<T> extends Functional<I<T>, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['json'],
        o: ['string'],
      },
      config
    )
  }

  f({ json }: I<T>, done): void {
    done({ string: JSON.stringify(json) })
  }
}
