import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { deepGetOrDefault } from '../../../../util/object'
import { ID_HAS_KEY } from '../../../_ids'

export interface I<T> {
  obj: Dict<T>
  path: string[]
  key: string | number
}

export interface O<T> {
  has: boolean
}

export default class DeepHasKey<T = any> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path', 'key'],
        o: ['has'],
      },
      {},
      system,
      ID_HAS_KEY
    )
  }

  f({ obj, path, key }: I<T>, done: Done<O<T>>): void {
    const has = deepGetOrDefault(obj, [...path, key], undefined) !== undefined

    done({ has })
  }
}
