import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_RANDOM } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  random: number
}

export default class Random<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['random'],
      },
      {},
      system,
      ID_RANDOM
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    done({ random: Math.random() })
  }
}
