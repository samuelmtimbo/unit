import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  obj: Dict<T>
  key: string | number
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T = any> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['obj', 'key'],
        o: ['has'],
      },
      {},
      system,
      pod
    )
  }

  f({ obj, key }: I<T>, done: Done<O<T>>): void {
    done({ has: obj.hasOwnProperty(key) })
  }
}
