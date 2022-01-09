import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  values: T[]
}

export default class Values<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['obj'],
        o: ['values'],
      },
      {},
      system,
      pod
    )
  }

  f({ obj }: I<T>, done): void {
    done({ values: Object.values(obj) })
  }
}
