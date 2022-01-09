import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  string: string
}

export interface O {
  json: object
}

export default class Stringify extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['string'],
        o: ['json'],
      },
      {},
      system,
      pod
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
