import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import set from './f'

export interface I<T> {
  obj: Dict<T>
  key: string | number
  value: T
}

export interface O<T> {
  obj: object
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['obj', 'key', 'value'],
        o: ['obj'],
      },
      {},
      system,
      pod
    )
  }

  f({ obj, key, value }: I<T>, done): void {
    done({ obj: set(obj, key, value) })
  }
}
