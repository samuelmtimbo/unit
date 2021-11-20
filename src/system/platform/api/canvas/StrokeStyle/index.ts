import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
  strokeStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class Stroke<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['strokeStyle', 'd'],
      o: ['d'],
    })
  }

  f({ d, strokeStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['strokeStyle', strokeStyle]],
    })
  }
}
