import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  d: any[][]
  fillStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class FillStyle<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['fillStyle', 'd'],
        o: ['d'],
      },
      config
    )
  }

  f({ d, fillStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['fillStyle', fillStyle]],
    })
  }
}
