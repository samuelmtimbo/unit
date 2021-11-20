import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  d: any[][]
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface O<T> {
  d: any[][]
}

export default class AddRect<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['rect', 'd'],
      o: ['d'],
    })
  }

  f({ d, rect: { x, y, width, height } }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rect', x, y, width, height]],
    })
  }
}
