import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  obj: Dict<T>
  key: string | number
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['obj', 'key'],
        o: ['has'],
      },
      config
    )
  }

  f({ obj, key }: I<T>, done: Done<O<T>>): void {
    done({ has: obj.hasOwnProperty(key) })
  }
}
