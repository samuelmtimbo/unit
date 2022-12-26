import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_VALUES } from '../../../_ids'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  values: T[]
}

export default class Values<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj'],
        o: ['values'],
      },
      {},
      system,
      ID_VALUES
    )
  }

  f({ obj }: I<T>, done): void {
    done({ values: Object.values(obj) })
  }
}
