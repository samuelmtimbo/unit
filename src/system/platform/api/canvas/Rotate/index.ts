import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  d: any[][]
  rad: number
}

export interface O<T> {
  d: any[][]
}

export default class Rotate<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['d', 'rad'],
        o: ['d'],
      },
      config
    )
  }

  f({ d, rad }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rotate', rad]],
    })
  }
}
