import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  d: any[][]
}

export interface O<T> {
  d: any[][]
}

export default class Fill<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['d'],
        o: ['d'],
      },
      config
    )
  }

  f({ d }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['fill']],
    })
  }
}
