import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

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
  constructor() {
    super({
      i: ['a', 'value', 'start', 'end'],
      o: ['a'],
    })
  }

  f({ a, value, start, end }: I<T>, done: Done<O<T>>): void {
    done({ a: a.fill(value, start, end) })
  }
}
