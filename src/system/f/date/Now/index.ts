import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_NOW } from '../../../_ids'

export interface I<T> {
  any: T
}

export interface O<T> {
  now: number
}

export default class Now<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['now'],
      },
      {},
      system,
      ID_NOW
    )
  }

  f({ any }: Partial<I<T>>, done: Done<O<T>>): void {
    done({ now: new Date().getTime() })
  }
}
