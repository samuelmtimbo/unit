import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
  rad: number
}

export interface O<T> {
  d: any[][]
}

export default class Rotate<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['d', 'rad'],
      o: ['d'],
    })
  }

  f({ d, rad }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rotate', rad]],
    })
  }
}
