import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  json: T
}

export interface O {
  string: string
}

export default class Stringify<T> extends Functional<I<T>, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['json'],
        o: ['string'],
      },
      {},
      system,
      pod
    )
  }

  f({ json }: I<T>, done): void {
    done({ string: JSON.stringify(json) })
  }
}
