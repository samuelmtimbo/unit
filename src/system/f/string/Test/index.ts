import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  str: string
  regex: string
}

export interface O<T> {
  match: boolean
}

export default class Test<T> extends Functional<I<T>, O<T>> {
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

  f({ str, regex }: Partial<I<T>>, done): void {
    done({ match: !!str.match(regex) })
  }
}
