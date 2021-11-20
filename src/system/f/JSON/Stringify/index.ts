import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  json: T
}

export interface O {
  string: string
}

export default class Stringify<T> extends Functional<I<T>, O> {
  constructor() {
    super({
      i: ['json'],
      o: ['string'],
    })
  }

  f({ json }: I<T>, done): void {
    done({ string: JSON.stringify(json) })
  }
}
