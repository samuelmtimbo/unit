import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  str: string
  regex: string
}

export interface O {
  match: string
}

export default class Match extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['str', 'regex'],
        o: ['match'],
      },
      {},
      system,
      pod
    )
  }

  f({ str, regex }: I, done): void {
    done({ match: str.match(regex) })
  }
}
