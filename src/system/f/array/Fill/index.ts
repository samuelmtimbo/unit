import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
  value: T
  start: number
  end: number
}

export interface O<T> {
  a: T[]
}

export default class Fill<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'value', 'start', 'end'],
        o: ['a'],
      },
      config
    )
  }

  f({ a, value, start, end }: I<T>, done: Done<O<T>>): void {
    done({ a: a.fill(value, start, end) })
  }
}
