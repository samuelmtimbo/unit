import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
}

export interface O<T> {
  d: any[][]
}

export default class Fill<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['d'],
      o: ['d'],
    })
  }

  f({ d }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['fill']],
    })
  }
}
