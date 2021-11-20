import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
  x: number
  y: number
}

export interface O<T> {
  d: any[][]
}

export default class MoveTo<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['x', 'y', 'd'],
      o: ['d'],
    })
  }

  f({ d, x, y }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['moveTo', x, y]],
    })
  }
}
