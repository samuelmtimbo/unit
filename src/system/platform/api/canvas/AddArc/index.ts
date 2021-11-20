import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
  arc: {
    x: number
    y: number
    r: number
    start: number
    end: number
    anticlockwise?: boolean
  }
}

export interface O<T> {
  d: any[][]
}

export default class DrawArc<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['arc', 'd'],
      o: ['d'],
    })
  }

  f(
    { d, arc: { x, y, r, start, end, anticlockwise = false } }: I<T>,
    done: Done<O<T>>
  ): void {
    done({
      d: [...d, ['arc', x, y, r, start, end, anticlockwise]],
    })
  }
}
