import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  d: any[][]
  strokeStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class Stroke<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['strokeStyle', 'd'],
        o: ['d'],
      },
      config
    )
  }

  f({ d, strokeStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['strokeStyle', strokeStyle]],
    })
  }
}
